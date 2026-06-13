package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.Prescription;
import com.hcl.DoctorAppointment.service.PrescriptionService;
import com.hcl.DoctorAppointment.util.AuditLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AuditLogger auditLogger;

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogger.log(actor, "ACCESS_PRESCRIPTIONS", "Accessed digital prescriptions for patient ID: " + patientId);
        return prescriptionService.getPrescriptionsByPatient(patientId);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        Prescription created = prescriptionService.createPrescription(prescription);
        auditLogger.log(actor, "CREATE_PRESCRIPTION", "Created prescription ID: " + created.getId() + " for patient ID: " + prescription.getPatient().getId());
        return ResponseEntity.ok(created);
    }
}
