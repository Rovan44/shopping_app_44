package com.shopify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private Long paymentModeId;
    private String transactionId;
    private BigDecimal amount;
    private String remarks;
}
