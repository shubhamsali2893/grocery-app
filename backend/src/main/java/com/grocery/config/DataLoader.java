package com.grocery.config;

import com.grocery.model.GroceryItem;
import com.grocery.repository.GroceryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;



@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (groceryItemRepository.count() == 0) {
            loadGroceryItems();
        }
    }

    private void loadGroceryItems() {
        // Create 10 grocery items with different quantities as specified
        GroceryItem[] items = {
            new GroceryItem("Fresh Bananas", "Sweet and ripe bananas", 2.99, 50, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop", "Fruits"),
            new GroceryItem("Organic Apples", "Crisp red apples", 4.99, 30, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop", "Fruits"),
            new GroceryItem("Whole Milk", "Fresh dairy milk 1L", 3.49, 25, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop", "Dairy"),
            new GroceryItem("Cheddar Cheese", "Aged cheddar cheese block", 6.99, 15, "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop", "Dairy"),
            new GroceryItem("Whole Wheat Bread", "Fresh baked whole wheat bread", 2.79, 20, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop", "Bakery"),
            new GroceryItem("Chicken Breast", "Boneless skinless chicken breast", 8.99, 12, "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop", "Meat"),
            new GroceryItem("Fresh Broccoli", "Green fresh broccoli crowns", 3.99, 18, "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=200&fit=crop", "Vegetables"),
            new GroceryItem("Roma Tomatoes", "Fresh red roma tomatoes", 4.49, 35, "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=300&h=200&fit=crop", "Vegetables"),
            new GroceryItem("Fresh Carrots", "Organic baby carrots, sweet and crunchy", 1.99, 60, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop", "Vegetables"),
            new GroceryItem("Salmon Fillet", "Fresh Atlantic salmon fillet, per lb", 12.99, 8, "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=200&fit=crop", "Seafood"),
            new GroceryItem("Avocados", "Ripe Hass avocados, perfect for guacamole", 3.99, 25, "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=200&fit=crop", "Fruits"),
            new GroceryItem("Pasta", "Italian spaghetti pasta, 1 lb box", 1.79, 50, "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=300&h=200&fit=crop", "Pantry"),
            new GroceryItem("Bell Peppers", "Colorful bell peppers mix - red, yellow, green", 4.99, 30, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=200&fit=crop", "Vegetables"),
            new GroceryItem("Brown Rice", "Long grain brown rice 2lb bag", 3.99, 40, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop", "Pantry"),
            new GroceryItem("Greek Yogurt", "Plain Greek yogurt 500g", 5.49, 22, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop", "Dairy")
        };

        for (GroceryItem item : items) {
            groceryItemRepository.save(item);
        }

        System.out.println("Loaded " + items.length + " grocery items into the database");
    }
}
