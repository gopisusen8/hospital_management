package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.PatientRecord;
import com.hcl.DoctorAppointment.service.PatientRecordService;
import com.hcl.DoctorAppointment.util.AuditLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patient-records")
public class PatientRecordController {

    @Autowired
    private PatientRecordService patientRecordService;

    @Autowired
    private AuditLogger auditLogger;

    @GetMapping("/patient/{patientId}")
    public List<PatientRecord> getRecordsByPatient(@PathVariable Long patientId) {
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        auditLogger.log(actor, "ACCESS_PATIENT_RECORDS", "Accessed medical records for patient ID: " + patientId);
        return patientRecordService.getRecordsByPatient(patientId);
    }

    @PostMapping
    public ResponseEntity<PatientRecord> createRecord(@RequestBody PatientRecord record) {
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        PatientRecord created = patientRecordService.createRecord(record);
        auditLogger.log(actor, "CREATE_PATIENT_RECORD", "Created new EHR patient record ID: " + created.getId() + " for patient ID: " + record.getPatient().getId());
        return ResponseEntity.ok(created);
    }
}
