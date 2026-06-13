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

    @Autowired
    private com.hcl.DoctorAppointment.repository.PatientRecordRepository recordRepository;

    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if ("CANCELLED".equalsIgnoreCase(status) || "CANCELED".equalsIgnoreCase(status)) {
            java.time.LocalDateTime startDateTime = appointment.getSlot().getStartDateTime();
            java.time.LocalDate appointmentDate = startDateTime.toLocalDate();
            java.time.LocalDate today = java.time.LocalDate.now();
            
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(today, appointmentDate);
            if (daysBetween < 2) {
                throw new RuntimeException("Cancellation is only allowed at least 2 days prior to the appointment date.");
            }
            
            // Release the slot
            com.hcl.DoctorAppointment.model.AvailabilitySlot slot = appointment.getSlot();
            if (slot != null) {
                slot.setIsBooked(false);
                slotRepository.save(slot);
            }
        }
        
        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);
        
        if ("COMPLETED".equalsIgnoreCase(status)) {
            com.hcl.DoctorAppointment.model.PatientRecord record = com.hcl.DoctorAppointment.model.PatientRecord.builder()
                    .patient(appointment.getPatient())
                    .doctor(appointment.getDoctor())
                    .visitDate(java.time.LocalDate.now())
                    .diagnosis("Completed Consultation")
                    .notes("Reason for consult: " + appointment.getReason())
                    .build();
            recordRepository.save(record);
        }
        
        return saved;
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
