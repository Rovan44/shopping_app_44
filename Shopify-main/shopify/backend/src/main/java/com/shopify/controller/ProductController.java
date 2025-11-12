package com.shopify.controller;

import com.shopify.entity.Category;
import com.shopify.entity.Product;
import com.shopify.repository.CategoryRepository;
import com.shopify.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Map<String, Object> productData) {
        try {
            Product product = new Product();
            product.setName((String) productData.get("name"));
            product.setPrice(((Number) productData.get("price")).doubleValue());
            product.setTotalItemsInStock(((Number) productData.get("totalItemsInStock")).intValue());
            product.setImageUrl((String) productData.get("imageUrl"));
            
            Long categoryId = ((Number) productData.get("categoryId")).longValue();
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
            
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> productData) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName((String) productData.get("name"));
                    product.setPrice(((Number) productData.get("price")).doubleValue());
                    product.setTotalItemsInStock(((Number) productData.get("totalItemsInStock")).intValue());
                    product.setImageUrl((String) productData.get("imageUrl"));
                    
                    Long categoryId = ((Number) productData.get("categoryId")).longValue();
                    Category category = categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new RuntimeException("Category not found"));
                    product.setCategory(category);
                    
                    Product updatedProduct = productRepository.save(product);
                    return ResponseEntity.ok(updatedProduct);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PatchMapping("/{id}/reduce-stock")
    public ResponseEntity<Product> reduceStock(@PathVariable Long id, @RequestBody Map<String, Object> requestData) {
        System.out.println("📦 Received stock reduction request for Product ID: " + id);
        System.out.println("Request data: " + requestData);
        
        return productRepository.findById(id)
                .map(product -> {
                    int quantity = ((Number) requestData.get("quantity")).intValue();
                    int currentStock = product.getTotalItemsInStock();
                    
                    System.out.println("Product: " + product.getName());
                    System.out.println("Current stock: " + currentStock);
                    System.out.println("Quantity to reduce: " + quantity);
                    
                    if (currentStock >= quantity) {
                        int newStock = currentStock - quantity;
                        product.setTotalItemsInStock(newStock);
                        Product updatedProduct = productRepository.save(product);
                        
                        System.out.println("✅ Stock updated! New stock: " + newStock);
                        return ResponseEntity.ok(updatedProduct);
                    } else {
                        System.out.println("❌ Insufficient stock! Cannot reduce by " + quantity);
                        return ResponseEntity.badRequest().<Product>build();
                    }
                })
                .orElseGet(() -> {
                    System.out.println("❌ Product not found with ID: " + id);
                    return ResponseEntity.notFound().build();
                });
    }
}
