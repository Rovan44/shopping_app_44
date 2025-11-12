package com.shopify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime paymentDate;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payment_mode_id", nullable = false)
    private PaymentMode paymentMode;
    
    @Column(nullable = true)
    private String transactionId;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    // Optional: Link to Order entity if you have one
    // @ManyToOne
    // @JoinColumn(name = "order_id")
    // private Order order;
    
    @Column(length = 500)
    private String remarks;
    
    @PrePersist
    protected void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDateTime.now();
        }
    }
    
    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
}
