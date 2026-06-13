package com.hcl.DoctorAppointment.repository;

import com.hcl.DoctorAppointment.model.PatientRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientRecordRepository extends JpaRepository<PatientRecord, Long> {
    List<PatientRecord> findByPatientId(Long patientId);
    List<PatientRecord> findByDoctorId(Long doctorId);
}
