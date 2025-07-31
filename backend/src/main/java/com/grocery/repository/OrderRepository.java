package com.grocery.repository;

import com.grocery.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerNameOrderByOrderDateDesc(String customerName);
    List<Order> findAllByOrderByOrderDateDesc();
}
