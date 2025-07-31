package com.grocery.controller;

import com.grocery.model.CartItem;
import com.grocery.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems() {
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> request) {
        
        Long groceryItemId = Long.valueOf(request.get("groceryItemId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        
        CartItem cartItem = cartService.addToCart(groceryItemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> request) {
        
        Integer quantity = request.get("quantity");
        CartItem updatedItem = cartService.updateCartItem(cartItemId, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Double>> getCartTotal() {
        Double total = cartService.getCartTotal();
        return ResponseEntity.ok(Map.of("total", total));
    }
}
