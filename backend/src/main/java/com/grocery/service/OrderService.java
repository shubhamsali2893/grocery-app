package com.grocery.service;

import com.grocery.model.*;
import com.grocery.repository.GroceryItemRepository;
import com.grocery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    public Order placeOrder(Map<String, String> orderDetails) {
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
        Double shippingFee = 0.0;
        
        // Calculate shipping fee based on shipping method
        String shippingMethod = orderDetails.getOrDefault("shippingMethod", "STANDARD");
        if ("EXPRESS".equals(shippingMethod)) {
            shippingFee = 9.99;
        } else if ("STANDARD".equals(shippingMethod)) {
            shippingFee = totalAmount < 50 ? 4.99 : 0.0; // Free shipping for orders over $50
        }
        
        // Create order with all details
        Order order = new Order();
        order.setTotalAmount(totalAmount + shippingFee);
        order.setCustomerName(orderDetails.get("customerName"));
        order.setCustomerAddress(orderDetails.get("customerAddress"));
        order.setCustomerPhone(orderDetails.get("customerPhone"));
        order.setCustomerEmail(orderDetails.get("customerEmail"));
        order.setPaymentMethod(orderDetails.get("paymentMethod"));
        order.setShippingMethod(shippingMethod);
        order.setShippingFee(shippingFee);
        
        // Set payment status based on payment method
        if ("COD".equals(orderDetails.get("paymentMethod"))) {
            order.setPaymentStatus("PENDING");
        } else {
            order.setPaymentStatus("PAID");
        }
        
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
