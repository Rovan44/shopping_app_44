package com.shopify;

import com.shopify.entity.Category;
import com.shopify.entity.Product;
import com.shopify.entity.PaymentMode;
import com.shopify.repository.CategoryRepository;
import com.shopify.repository.ProductRepository;
import com.shopify.repository.PaymentModeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PaymentModeRepository paymentModeRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create Categories only if none exist
        if (categoryRepository.count() == 0) {
            Category food = categoryRepository.save(new Category("Food"));
            Category mobiles = categoryRepository.save(new Category("Mobiles"));
            Category electronics = categoryRepository.save(new Category("Electronics"));
            Category stationery = categoryRepository.save(new Category("Stationery"));
            
            // Create Sample Products (Prices in INR)
            productRepository.save(new Product("Organic Apple", 299.00, 150, "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", food));
            productRepository.save(new Product("iPhone 15 Pro", 134900.00, 50, "https://images.unsplash.com/photo-1678652197950-32d529427814?w=400", mobiles));
            productRepository.save(new Product("Sony Headphones", 24999.00, 75, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", electronics));
            productRepository.save(new Product("Notebook Set", 899.00, 200, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400", stationery));
            
            System.out.println("Categories and products initialized!");
        } else {
            System.out.println("Categories already exist. Skipping category initialization.");
        }
        
        // Create Payment Modes only if none exist
        if (paymentModeRepository.count() == 0) {
            paymentModeRepository.save(new PaymentMode("Cash On Delivery"));
            paymentModeRepository.save(new PaymentMode("UPI"));
            paymentModeRepository.save(new PaymentMode("Debit/Credit Card"));
            paymentModeRepository.save(new PaymentMode("Net Banking"));
            paymentModeRepository.save(new PaymentMode("Wallet"));
            System.out.println("Payment modes initialized!");
        } else {
            System.out.println("Payment modes already exist. Skipping payment mode initialization.");
        }
        
        System.out.println("Database initialization complete!");
    }
}
