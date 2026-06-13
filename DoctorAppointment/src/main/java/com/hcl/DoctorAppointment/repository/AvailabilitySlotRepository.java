package com.hcl.DoctorAppointment.repository;

import com.hcl.DoctorAppointment.model.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByDoctorId(Long doctorId);
    List<AvailabilitySlot> findByDoctorIdAndIsBooked(Long doctorId, Boolean isBooked);
}
