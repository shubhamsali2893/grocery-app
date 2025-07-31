package com.grocery.service;

import com.grocery.model.GroceryItem;
import com.grocery.repository.GroceryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroceryService {

    @Autowired
    private GroceryItemRepository groceryItemRepository;

    public List<GroceryItem> getAllItems() {
        return groceryItemRepository.findAll();
    }

    public Optional<GroceryItem> getItemById(Long id) {
        return groceryItemRepository.findById(id);
    }

    public List<GroceryItem> getItemsByCategory(String category) {
        return groceryItemRepository.findByCategory(category);
    }

    public List<GroceryItem> searchItems(String name) {
        return groceryItemRepository.findByNameContainingIgnoreCase(name);
    }

    public GroceryItem saveItem(GroceryItem item) {
        return groceryItemRepository.save(item);
    }

    public void deleteItem(Long id) {
        groceryItemRepository.deleteById(id);
    }
}
