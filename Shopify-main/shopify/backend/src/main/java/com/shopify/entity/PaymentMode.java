package com.shopify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payment_modes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String mode;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    public PaymentMode(String mode) {
        this.mode = mode;
        this.isActive = true;
    }
}
