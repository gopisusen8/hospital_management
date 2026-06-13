package com.hcl.DoctorAppointment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentRequest {

    @NotNull(message = "Doctor ID cannot be null")
    private Long doctorId;

    @NotNull(message = "Slot ID cannot be null")
    private Long slotId;

    private String reason;
}
