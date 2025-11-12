package com.shopify.controller;

import com.shopify.dto.PaymentRequestDTO;
import com.shopify.dto.PaymentResponseDTO;
import com.shopify.entity.Payment.PaymentStatus;
import com.shopify.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO requestDTO) {
        try {
            PaymentResponseDTO response = paymentService.createPayment(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<?> getPaymentByTransactionId(@PathVariable String transactionId) {
        try {
            PaymentResponseDTO payment = paymentService.getPaymentByTransactionId(transactionId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id, 
            @RequestParam PaymentStatus status) {
        try {
            PaymentResponseDTO updated = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats/total")
    public ResponseEntity<BigDecimal> getTotalCompletedPayments() {
        return ResponseEntity.ok(paymentService.getTotalCompletedPayments());
    }
    
    @GetMapping("/stats/count/{status}")
    public ResponseEntity<Long> getPaymentCountByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentCountByStatus(status));
    }
}
