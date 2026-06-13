package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Doctor;
import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public List<Doctor> getDoctorsByDepartment(String department) {
        return doctorRepository.findByDepartment(department);
    }

    @Autowired
    private com.hcl.DoctorAppointment.repository.AppointmentRepository appointmentRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository slotRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.UserRepository userRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.PrescriptionRepository prescriptionRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.BillRepository billRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.PaymentRepository paymentRepository;
    @Autowired
    private com.hcl.DoctorAppointment.repository.PatientRecordRepository patientRecordRepository;

    @jakarta.transaction.Transactional
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Find all appointments for this doctor
        List<com.hcl.DoctorAppointment.model.Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        
        // Find and delete all bills and payments associated with these appointments
        for (com.hcl.DoctorAppointment.model.Appointment appointment : appointments) {
            Optional<com.hcl.DoctorAppointment.model.Bill> billOpt = billRepository.findByAppointmentId(appointment.getId());
            if (billOpt.isPresent()) {
                com.hcl.DoctorAppointment.model.Bill bill = billOpt.get();
                Optional<com.hcl.DoctorAppointment.model.Payment> paymentOpt = paymentRepository.findByBillId(bill.getId());
                if (paymentOpt.isPresent()) {
                    paymentRepository.delete(paymentOpt.get());
                }
                billRepository.delete(bill);
            }
        }
        
        // Delete all prescriptions associated with this doctor
        List<com.hcl.DoctorAppointment.model.Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);
        prescriptionRepository.deleteAll(prescriptions);
        
        // Delete all patient records associated with this doctor
        List<com.hcl.DoctorAppointment.model.PatientRecord> patientRecords = patientRecordRepository.findByDoctorId(doctorId);
        patientRecordRepository.deleteAll(patientRecords);
        
        // Delete associated appointments
        appointmentRepository.deleteAll(appointments);
        
        // Delete associated slots
        slotRepository.deleteAll(slotRepository.findByDoctorId(doctorId));
        
        // Delete doctor profile and user account
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        if (user != null) {
            userRepository.delete(user);
        }
    }
}
