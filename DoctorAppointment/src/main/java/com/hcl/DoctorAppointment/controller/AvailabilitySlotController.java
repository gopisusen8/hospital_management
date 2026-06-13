package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.AvailabilitySlot;
import com.hcl.DoctorAppointment.model.Doctor;
import com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository;
import com.hcl.DoctorAppointment.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability-slots")
public class AvailabilitySlotController {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/doctor/{doctorId}")
    public List<AvailabilitySlot> getSlotsByDoctor(@PathVariable Long doctorId) {
        return availabilitySlotRepository.findByDoctorId(doctorId);
    }

    @GetMapping("/doctor/{doctorId}/available")
    public List<AvailabilitySlot> getAvailableSlotsByDoctor(@PathVariable Long doctorId) {
        return availabilitySlotRepository.findByDoctorIdAndIsBooked(doctorId, false);
    }

    @PostMapping
    public ResponseEntity<?> createSlot(@RequestBody AvailabilitySlot slot) {
        if (slot.getDoctor() == null || slot.getDoctor().getId() == null) {
            return ResponseEntity.badRequest().body("Doctor details are required");
        }
        Optional<Doctor> docOpt = doctorRepository.findById(slot.getDoctor().getId());
        if (docOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Doctor not found");
        }
        slot.setDoctor(docOpt.get());
        if (slot.getIsBooked() == null) {
            slot.setIsBooked(false);
        }
        AvailabilitySlot saved = availabilitySlotRepository.save(slot);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        Optional<AvailabilitySlot> slotOpt = availabilitySlotRepository.findById(id);
        if (slotOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AvailabilitySlot slot = slotOpt.get();
        if (slot.getIsBooked()) {
            return ResponseEntity.badRequest().body("Cannot delete a booked slot");
        }
        availabilitySlotRepository.delete(slot);
        return ResponseEntity.ok().build();
    }
}
