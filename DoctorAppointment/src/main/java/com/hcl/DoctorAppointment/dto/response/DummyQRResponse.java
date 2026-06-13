package com.hcl.DoctorAppointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DummyQRResponse {
    private Long billId;
    private Double amount;
    private String qrCodeUrl;
}
