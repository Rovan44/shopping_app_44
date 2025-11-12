package com.shopify.dto;

import com.shopify.entity.Payment.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Long id;
    private LocalDateTime paymentDate;
    private String paymentMode;
    private String transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String remarks;
}
