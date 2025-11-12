package com.shopify.repository;

import com.shopify.entity.Payment;
import com.shopify.entity.Payment.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByStatus(PaymentStatus status);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByPaymentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    BigDecimal getTotalCompletedPayments();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = ?1")
    long countByStatus(PaymentStatus status);
}
