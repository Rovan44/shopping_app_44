package com.shopify.service;

import com.shopify.entity.PaymentMode;
import com.shopify.repository.PaymentModeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentModeService {
    
    @Autowired
    private PaymentModeRepository paymentModeRepository;
    
    public List<PaymentMode> getAllPaymentModes() {
        return paymentModeRepository.findAll();
    }
    
    public List<PaymentMode> getActivePaymentModes() {
        return paymentModeRepository.findByIsActiveTrue();
    }
    
    public Optional<PaymentMode> getPaymentModeById(Long id) {
        return paymentModeRepository.findById(id);
    }
    
    public Optional<PaymentMode> getPaymentModeByName(String mode) {
        return paymentModeRepository.findByMode(mode);
    }
    
    public PaymentMode createPaymentMode(PaymentMode paymentMode) {
        if (paymentModeRepository.existsByMode(paymentMode.getMode())) {
            throw new IllegalArgumentException("Payment mode already exists: " + paymentMode.getMode());
        }
        return paymentModeRepository.save(paymentMode);
    }
    
    public PaymentMode updatePaymentMode(Long id, PaymentMode paymentMode) {
        PaymentMode existing = paymentModeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment mode not found with id: " + id));
        
        existing.setMode(paymentMode.getMode());
        existing.setIsActive(paymentMode.getIsActive());
        return paymentModeRepository.save(existing);
    }
    
    public void deletePaymentMode(Long id) {
        paymentModeRepository.deleteById(id);
    }
    
    public void togglePaymentModeStatus(Long id) {
        PaymentMode paymentMode = paymentModeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment mode not found with id: " + id));
        
        paymentMode.setIsActive(!paymentMode.getIsActive());
        paymentModeRepository.save(paymentMode);
    }
}
