package com.shopify.service;

import com.shopify.dto.PaymentRequestDTO;
import com.shopify.dto.PaymentResponseDTO;
import com.shopify.entity.Payment;
import com.shopify.entity.Payment.PaymentStatus;
import com.shopify.entity.PaymentMode;
import com.shopify.repository.PaymentRepository;
import com.shopify.repository.PaymentModeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PaymentModeRepository paymentModeRepository;
    
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO) {
        // Validate payment mode
        PaymentMode paymentMode = paymentModeRepository.findById(requestDTO.getPaymentModeId())
            .orElseThrow(() -> new RuntimeException("Payment mode not found with id: " + requestDTO.getPaymentModeId()));
        
        if (!paymentMode.getIsActive()) {
            throw new RuntimeException("Payment mode is not active: " + paymentMode.getMode());
        }
        
        // Validate amount
        if (requestDTO.getAmount() == null || requestDTO.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        
        // Create payment
        Payment payment = new Payment();
        payment.setPaymentMode(paymentMode);
        payment.setAmount(requestDTO.getAmount());
        payment.setTransactionId(requestDTO.getTransactionId());
        payment.setRemarks(requestDTO.getRemarks());
        payment.setPaymentDate(LocalDateTime.now());
        
        // Set status based on payment mode
        if ("Cash On Delivery".equalsIgnoreCase(paymentMode.getMode())) {
            payment.setStatus(PaymentStatus.PENDING);
        } else {
            // For online payments, you would integrate with payment gateway here
            // For now, we'll set it as PENDING
            payment.setStatus(PaymentStatus.PENDING);
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        return convertToDTO(savedPayment);
    }
    
    public PaymentResponseDTO updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        
        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDTO(updatedPayment);
    }
    
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return convertToDTO(payment);
    }
    
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public PaymentResponseDTO getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("Payment not found with transaction id: " + transactionId));
        return convertToDTO(payment);
    }
    
    public BigDecimal getTotalCompletedPayments() {
        BigDecimal total = paymentRepository.getTotalCompletedPayments();
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public long getPaymentCountByStatus(PaymentStatus status) {
        return paymentRepository.countByStatus(status);
    }
    
    private PaymentResponseDTO convertToDTO(Payment payment) {
        return new PaymentResponseDTO(
            payment.getId(),
            payment.getPaymentDate(),
            payment.getPaymentMode().getMode(),
            payment.getTransactionId(),
            payment.getAmount(),
            payment.getStatus(),
            payment.getRemarks()
        );
    }
}
