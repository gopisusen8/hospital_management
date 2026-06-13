package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Appointment;
import com.hcl.DoctorAppointment.model.AvailabilitySlot;
import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.model.Doctor;
import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.repository.AppointmentRepository;
import com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository;
import com.hcl.DoctorAppointment.repository.BillRepository;
import com.hcl.DoctorAppointment.repository.DoctorRepository;
import com.hcl.DoctorAppointment.repository.UserRepository;
import com.hcl.DoctorAppointment.exception.SlotNotAvailableException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Transactional
    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getSlot() == null || appointment.getSlot().getId() == null) {
            throw new IllegalArgumentException("Slot details are required");
        }

        // 1. Load the slot with pessimistic write lock
        AvailabilitySlot slot = availabilitySlotRepository.findByIdForUpdate(appointment.getSlot().getId())
                .orElseThrow(() -> new SlotNotAvailableException("Availability slot not found"));

        // 2. Prevent double-booking conflict
        if (slot.getIsBooked()) {
            throw new SlotNotAvailableException("This slot has already been booked");
        }

        // 3. Mark the slot as booked
        slot.setIsBooked(true);
        availabilitySlotRepository.save(slot);

        // Fetch patient and doctor details from DB
        User patient = userRepository.findById(appointment.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        appointment.setSlot(slot);
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setStatus("Requested");
        
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 4. Automatically generate a Bill
        double baseFee = doctor.getConsultationFee() != null ? doctor.getConsultationFee() : 100.0;
        double tax = baseFee * 0.1; // 10% tax
        
        // Simple first-consultation discount: check if patient has other appointments
        double discount = 0.0;
        List<Appointment> existing = appointmentRepository.findByPatientId(patient.getId());
        if (existing.size() <= 1) {
            discount = baseFee * 0.2; // 20% first consultation discount
        }

        Bill bill = Bill.builder()
                .patient(patient)
                .appointment(savedAppointment)
                .amount(baseFee)
                .tax(tax)
                .discount(discount)
                .status("UNPAID")
                .dueDate(LocalDate.now().plusDays(5))
                .build();
        
        billRepository.save(bill);

        return savedAppointment;
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Appointment updateStatus(Long id, String status) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        app.setStatus(status);
        if ("CANCELLED".equalsIgnoreCase(status) && app.getSlot() != null) {
            AvailabilitySlot slot = app.getSlot();
            slot.setIsBooked(false);
            availabilitySlotRepository.save(slot);
        }
        return appointmentRepository.save(app);
    }
}
