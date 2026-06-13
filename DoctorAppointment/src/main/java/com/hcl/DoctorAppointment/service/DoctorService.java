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

    @jakarta.transaction.Transactional
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Delete associated appointments
        appointmentRepository.deleteAll(appointmentRepository.findByDoctorId(doctorId));
        
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
