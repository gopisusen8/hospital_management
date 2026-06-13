package com.hcl.DoctorAppointment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionRequest {

    private Long appointmentId;

    @NotNull(message = "Patient ID cannot be null")
    private Long patientId;

    @NotBlank(message = "Instructions cannot be blank")
    private String instructions;
}
