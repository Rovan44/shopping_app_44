package com.shopify.controller;

import com.shopify.entity.PaymentMode;
import com.shopify.service.PaymentModeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payment-modes")
public class PaymentModeController {
    
    @Autowired
    private PaymentModeService paymentModeService;
    
    @GetMapping
    public ResponseEntity<List<PaymentMode>> getAllPaymentModes() {
        return ResponseEntity.ok(paymentModeService.getAllPaymentModes());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<PaymentMode>> getActivePaymentModes() {
        return ResponseEntity.ok(paymentModeService.getActivePaymentModes());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMode> getPaymentModeById(@PathVariable Long id) {
        return paymentModeService.getPaymentModeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<PaymentMode> createPaymentMode(@RequestBody PaymentMode paymentMode) {
        try {
            PaymentMode created = paymentModeService.createPaymentMode(paymentMode);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PaymentMode> updatePaymentMode(
            @PathVariable Long id, 
            @RequestBody PaymentMode paymentMode) {
        try {
            PaymentMode updated = paymentModeService.updatePaymentMode(id, paymentMode);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMode(@PathVariable Long id) {
        paymentModeService.deletePaymentMode(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> togglePaymentModeStatus(@PathVariable Long id) {
        try {
            paymentModeService.togglePaymentModeStatus(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
