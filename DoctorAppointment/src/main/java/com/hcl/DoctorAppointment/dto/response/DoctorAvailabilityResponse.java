package com.hcl.DoctorAppointment.dto.response;

import com.hcl.DoctorAppointment.model.AvailabilitySlot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DoctorAvailabilityResponse {
    private Long doctorId;
    private String doctorName;
    private List<AvailabilitySlot> slots;
}
