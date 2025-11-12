package com.shopify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private double price;
    
    @Column(nullable = false)
    private int totalItemsInStock;
    
    @Column(length = 1000)
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    public Product(String name, double price, int totalItemsInStock, Category category) {
        this.name = name;
        this.price = price;
        this.totalItemsInStock = totalItemsInStock;
        this.category = category;
    }
    
    public Product(String name, double price, int totalItemsInStock, String imageUrl, Category category) {
        this.name = name;
        this.price = price;
        this.totalItemsInStock = totalItemsInStock;
        this.imageUrl = imageUrl;
        this.category = category;
    }
}
