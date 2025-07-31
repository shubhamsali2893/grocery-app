package com.grocery.controller;

import com.grocery.model.GroceryItem;
import com.grocery.service.GroceryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grocery")
@CrossOrigin(origins = "http://localhost:4200")
public class GroceryController {

    @Autowired
    private GroceryService groceryService;

    @GetMapping("/items")
    public ResponseEntity<List<GroceryItem>> getAllItems() {
        List<GroceryItem> items = groceryService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<GroceryItem> getItemById(@PathVariable Long id) {
        Optional<GroceryItem> item = groceryService.getItemById(id);
        return item.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<GroceryItem>> getItemsByCategory(@PathVariable String category) {
        List<GroceryItem> items = groceryService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/search")
    public ResponseEntity<List<GroceryItem>> searchItems(@RequestParam String name) {
        List<GroceryItem> items = groceryService.searchItems(name);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<GroceryItem> createItem(@RequestBody GroceryItem item) {
        GroceryItem savedItem = groceryService.saveItem(item);
        return ResponseEntity.ok(savedItem);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<GroceryItem> updateItem(@PathVariable Long id, @RequestBody GroceryItem item) {
        item.setId(id);
        GroceryItem updatedItem = groceryService.saveItem(item);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        groceryService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
