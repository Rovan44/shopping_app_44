package com.shopify.repository;

import com.shopify.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT SUM(p.price * p.totalItemsInStock) FROM Product p")
    Double findTotalInventoryValue();
    
    @Query("SELECT SUM(p.totalItemsInStock) FROM Product p")
    Long findTotalItemsInStock();
}
