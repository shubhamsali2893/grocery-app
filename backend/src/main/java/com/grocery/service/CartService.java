package com.grocery.service;

import com.grocery.model.CartItem;
import com.grocery.model.GroceryItem;
import com.grocery.repository.CartItemRepository;
import com.grocery.repository.GroceryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    @Transactional
    public CartItem addToCart(Long groceryItemId, Integer quantity) {
        Optional<GroceryItem> groceryItemOpt = groceryItemRepository.findById(groceryItemId);
        if (groceryItemOpt.isEmpty()) {
            throw new RuntimeException("Grocery item not found");
        }

        GroceryItem groceryItem = groceryItemOpt.get();
        
        // Check if item already exists in cart
        Optional<CartItem> existingCartItem = cartItemRepository.findByGroceryItemId(groceryItemId);
        
        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = new CartItem(groceryItem, quantity);
            return cartItemRepository.save(newCartItem);
        }
    }

    @Transactional
    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            throw new RuntimeException("Cart item not found");
        }

        CartItem cartItem = cartItemOpt.get();
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart() {
        cartItemRepository.deleteAll();
    }

    public Double getCartTotal() {
        List<CartItem> cartItems = cartItemRepository.findAll();
        return cartItems.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
    }
}
