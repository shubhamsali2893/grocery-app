package com.grocery.config;

import com.grocery.model.GroceryItem;
import com.grocery.repository.GroceryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (groceryItemRepository.count() == 0) {
            initializeGroceryItems();
        }
    }

    private void initializeGroceryItems() {
        groceryItemRepository.save(new GroceryItem(
            "Fresh Bananas", 
            "Organic yellow bananas, perfect for snacking", 
            2.99, 
            50, 
            "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop", 
            "Fruits"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Red Apples", 
            "Crisp and sweet red apples", 
            4.99, 
            30, 
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop", 
            "Fruits"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Whole Milk", 
            "Fresh whole milk, 1 gallon", 
            3.49, 
            25, 
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop", 
            "Dairy"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Organic Eggs", 
            "Farm fresh organic eggs, dozen", 
            5.99, 
            40, 
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop", 
            "Dairy"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Whole Wheat Bread", 
            "Freshly baked whole wheat bread", 
            2.79, 
            20, 
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", 
            "Bakery"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Chicken Breast", 
            "Boneless skinless chicken breast, per lb", 
            7.99, 
            15, 
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop", 
            "Meat"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Fresh Spinach", 
            "Organic baby spinach leaves", 
            3.99, 
            35, 
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop", 
            "Vegetables"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Roma Tomatoes", 
            "Fresh roma tomatoes, perfect for cooking", 
            2.49, 
            45, 
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.lovefoodhatewaste.com%2Ffoods-and-recipes%2Ftomatoes&psig=AOvVaw3kUEJlByGZbV6J7dIEuRxT&ust=1754067474925000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCJDVltnI544DFQAAAAAdAAAAABAE", 
            "Vegetables"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Greek Yogurt", 
            "Creamy Greek yogurt, vanilla flavored", 
            4.49, 
            28, 
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", 
            "Dairy"
        ));

        groceryItemRepository.save(new GroceryItem(
            "Orange Juice", 
            "Freshly squeezed orange juice, 64 oz", 
            4.99, 
            22, 
            "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop", 
            "Beverages"
        ));
    }
}
