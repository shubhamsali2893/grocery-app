package com.grocery.controller;

import com.grocery.model.Order;
import com.grocery.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerName}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable String customerName) {
        List<Order> orders = orderService.getOrdersByCustomer(customerName);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Map<String, String> customerDetails) {
        
        String customerName = customerDetails.get("customerName");
        String customerAddress = customerDetails.get("customerAddress");
        String customerPhone = customerDetails.get("customerPhone");
        
        try {
            Order order = orderService.placeOrder(customerName, customerAddress, customerPhone);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.get("status"));
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
