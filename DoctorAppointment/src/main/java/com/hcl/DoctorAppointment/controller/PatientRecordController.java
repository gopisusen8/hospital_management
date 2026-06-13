package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.PatientRecord;
import com.hcl.DoctorAppointment.service.PatientRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patient-records")
public class PatientRecordController {

    @Autowired
    private PatientRecordService patientRecordService;

    @GetMapping("/patient/{patientId}")
    public List<PatientRecord> getRecordsByPatient(@PathVariable Long patientId) {
        return patientRecordService.getRecordsByPatient(patientId);
    }

    @PostMapping
    public ResponseEntity<PatientRecord> createRecord(@RequestBody PatientRecord record) {
        return ResponseEntity.ok(patientRecordService.createRecord(record));
    }

    @GetMapping
    public List<PatientRecord> getAllRecords() {
        return patientRecordService.getAllRecords();
    }
}
