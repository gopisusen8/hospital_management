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

    @GetMapping("/specialization/{spec}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable String spec) {
        return doctorService.getDoctorsBySpecialization(spec);
    }
}
