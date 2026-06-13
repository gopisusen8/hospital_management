package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.PatientRecord;
import com.hcl.DoctorAppointment.repository.PatientRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientRecordService {

    @Autowired
    private PatientRecordRepository patientRecordRepository;

    public List<PatientRecord> getRecordsByPatient(Long patientId) {
        return patientRecordRepository.findByPatientId(patientId);
    }

    public List<PatientRecord> getRecordsByDoctor(Long doctorId) {
        return patientRecordRepository.findByDoctorId(doctorId);
    }

    public PatientRecord createRecord(PatientRecord record) {
        return patientRecordRepository.save(record);
    }

    public Optional<PatientRecord> getRecordById(Long id) {
        return patientRecordRepository.findById(id);
    }
}
