package com.hcl.DoctorAppointment.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmRequest {

    @NotBlank(message = "Transaction ID cannot be blank")
    private String transactionId;
}
