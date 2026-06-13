package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Appointment;
import com.hcl.DoctorAppointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository slotRepository;

    @Autowired
    private com.hcl.DoctorAppointment.repository.BillRepository billRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment bookAppointment(Appointment appointment) {
        com.hcl.DoctorAppointment.model.AvailabilitySlot slot = slotRepository.findById(appointment.getSlot().getId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        slot.setIsBooked(true);
        slotRepository.save(slot);

        appointment.setSlot(slot);
        appointment.setStatus("CONFIRMED");
        Appointment saved = appointmentRepository.save(appointment);

        // Auto-generate Bill/Invoice
        com.hcl.DoctorAppointment.model.Bill bill = com.hcl.DoctorAppointment.model.Bill.builder()
                .patient(appointment.getPatient())
                .appointment(saved)
                .amount(appointment.getDoctor() != null && appointment.getDoctor().getConsultationFee() != null 
                        ? appointment.getDoctor().getConsultationFee() : 100.0)
                .tax(10.0)
                .discount(0.0)
                .status("UNPAID")
                .dueDate(java.time.LocalDate.now().plusDays(7))
                .build();
        billRepository.save(bill);

        return saved;
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
