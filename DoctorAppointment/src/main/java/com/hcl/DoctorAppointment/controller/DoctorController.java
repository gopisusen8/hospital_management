package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.Doctor;
import com.hcl.DoctorAppointment.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository slotRepository;

    @Autowired
    private com.hcl.DoctorAppointment.repository.DoctorRepository doctorRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Doctor> getDoctorByUserId(@PathVariable Long userId) {
        return doctorRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/slots")
    public List<com.hcl.DoctorAppointment.model.AvailabilitySlot> getSlotsByDoctorId(@PathVariable Long id) {
        return slotRepository.findByDoctorId(id);
    }

    @PostMapping("/{id}/slots")
    public ResponseEntity<com.hcl.DoctorAppointment.model.AvailabilitySlot> addSlot(
            @PathVariable Long id, 
            @RequestBody com.hcl.DoctorAppointment.model.AvailabilitySlot slot) {
        Doctor doctor = doctorService.getDoctorById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        slot.setDoctor(doctor);
        slot.setIsBooked(false);
        return ResponseEntity.ok(slotRepository.save(slot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long slotId) {
        slotRepository.deleteById(slotId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        Doctor doctor = doctorService.getDoctorById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setDepartment(doctorDetails.getDepartment());
        if (doctorDetails.getConsultationFee() != null) {
            doctor.setConsultationFee(doctorDetails.getConsultationFee());
        }
        if (doctorDetails.getBio() != null) {
            doctor.setBio(doctorDetails.getBio());
        }
        if (doctorDetails.getRating() != null) {
            doctor.setRating(doctorDetails.getRating());
        }
        return ResponseEntity.ok(doctorService.saveDoctor(doctor));
    }
}
