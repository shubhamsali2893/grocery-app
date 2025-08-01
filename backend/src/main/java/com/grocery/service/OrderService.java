package com.grocery.service;

import com.grocery.model.*;
import com.grocery.repository.GroceryItemRepository;
import com.grocery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;
    
    @Autowired
    private GroceryItemRepository groceryItemRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByCustomer(String customerName) {
        return orderRepository.findByCustomerNameOrderByOrderDateDesc(customerName);
    }

    @Transactional
    public Order placeOrder(String customerName, String customerAddress, String customerPhone) {
        List<CartItem> cartItems = cartService.getCartItems();
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Check if all items have sufficient stock
        for (CartItem cartItem : cartItems) {
            GroceryItem item = cartItem.getGroceryItem();
            if (item.getAvailableQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for item: " + item.getName());
            }
        }

        Double totalAmount = cartService.getCartTotal();
        
        Order order = new Order(totalAmount, customerName, customerAddress, customerPhone);
        order = orderRepository.save(order);

        // Create order items from cart items and update stock
        final Order finalOrder = order;
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> {
                    // Decrease available quantity
                    GroceryItem item = cartItem.getGroceryItem();
                    int newQuantity = item.getAvailableQuantity() - cartItem.getQuantity();
                    item.setAvailableQuantity(newQuantity);
                    groceryItemRepository.save(item);
                    
                    // Create order item
                    return new OrderItem(
                        finalOrder,
                        item,
                        cartItem.getQuantity(),
                        item.getPrice()
                    );
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order = orderRepository.save(order);

        // Clear the cart after placing order
        cartService.clearCart();

        return order;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus(status);
        
        // Update estimated delivery based on status
        if (status == Order.OrderStatus.CONFIRMED) {
            order.setEstimatedDelivery(LocalDateTime.now().plusHours(2));
        } else if (status == Order.OrderStatus.PREPARING) {
            order.setEstimatedDelivery(LocalDateTime.now().plusHours(1));
        } else if (status == Order.OrderStatus.OUT_FOR_DELIVERY) {
            order.setEstimatedDelivery(LocalDateTime.now().plusMinutes(30));
        }

        return orderRepository.save(order);
    }
}
