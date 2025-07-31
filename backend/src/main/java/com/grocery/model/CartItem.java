package com.grocery.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "grocery_item_id", nullable = false)
    private GroceryItem groceryItem;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;



    // Constructors
    public CartItem() {}

    public CartItem(GroceryItem groceryItem, Integer quantity) {
        this.groceryItem = groceryItem;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GroceryItem getGroceryItem() { return groceryItem; }
    public void setGroceryItem(GroceryItem groceryItem) { this.groceryItem = groceryItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }



    public Double getTotalPrice() {
        return groceryItem.getPrice() * quantity;
    }
}
