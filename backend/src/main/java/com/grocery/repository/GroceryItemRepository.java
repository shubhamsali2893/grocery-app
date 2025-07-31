package com.grocery.repository;

import com.grocery.model.GroceryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroceryItemRepository extends JpaRepository<GroceryItem, Long> {
    List<GroceryItem> findByCategory(String category);
    List<GroceryItem> findByNameContainingIgnoreCase(String name);
}
