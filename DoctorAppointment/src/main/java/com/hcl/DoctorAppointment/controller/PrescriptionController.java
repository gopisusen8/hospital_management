package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.Prescription;
import com.hcl.DoctorAppointment.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return prescriptionService.getPrescriptionsByPatient(patientId);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.createPrescription(prescription));
    }
}
