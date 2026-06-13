package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Prescription;
import com.hcl.DoctorAppointment.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private com.hcl.DoctorAppointment.repository.PatientRecordRepository recordRepository;

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public Prescription createPrescription(Prescription prescription) {
        Prescription saved = prescriptionRepository.save(prescription);
        
        com.hcl.DoctorAppointment.model.PatientRecord record = com.hcl.DoctorAppointment.model.PatientRecord.builder()
                .patient(prescription.getPatient())
                .doctor(prescription.getDoctor())
                .visitDate(prescription.getDate())
                .diagnosis("Prescribed Medication")
                .notes("Issued prescription details: " + prescription.getInstructions())
                .build();
        recordRepository.save(record);
        
        return saved;
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }
}
