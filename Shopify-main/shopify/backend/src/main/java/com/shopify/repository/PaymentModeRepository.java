package com.shopify.repository;

import com.shopify.entity.PaymentMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentModeRepository extends JpaRepository<PaymentMode, Long> {
    
    Optional<PaymentMode> findByMode(String mode);
    
    List<PaymentMode> findByIsActiveTrue();
    
    boolean existsByMode(String mode);
}
