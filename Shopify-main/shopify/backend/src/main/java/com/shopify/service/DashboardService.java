package com.shopify.service;

import com.shopify.dto.DashboardStatsDTO;
import com.shopify.entity.Category;
import com.shopify.entity.Payment;
import com.shopify.repository.CategoryRepository;
import com.shopify.repository.PaymentRepository;
import com.shopify.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PaymentRepository paymentRepository;
    
    public DashboardStatsDTO getDashboardStats() {
        long totalProducts = productRepository.count();
        List<Category> categories = categoryRepository.findAll();
        Double totalValue = productRepository.findTotalInventoryValue();
        Long totalItemsInStock = productRepository.findTotalItemsInStock();
        
        // Get recent 5 payments sorted by date descending
        List<Payment> recentPayments = paymentRepository.findAll(
            PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "paymentDate"))
        ).getContent();
        
        // Handle null values
        if (totalValue == null) totalValue = 0.0;
        if (totalItemsInStock == null) totalItemsInStock = 0L;
        
        return new DashboardStatsDTO(totalProducts, categories, totalValue, totalItemsInStock, recentPayments);
    }
}
