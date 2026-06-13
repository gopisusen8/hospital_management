package com.hcl.DoctorAppointment.scheduler;

import com.hcl.DoctorAppointment.model.Payment;
import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.model.Appointment;
import com.hcl.DoctorAppointment.model.AvailabilitySlot;
import com.hcl.DoctorAppointment.repository.PaymentRepository;
import com.hcl.DoctorAppointment.repository.BillRepository;
import com.hcl.DoctorAppointment.repository.AppointmentRepository;
import com.hcl.DoctorAppointment.repository.AvailabilitySlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class PaymentTimeoutScheduler {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    // Run every 10 seconds to detect timeouts quickly
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void checkPendingPaymentTimeouts() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(2);
        List<Payment> pendingPayments = paymentRepository.findAll();
        
        for (Payment payment : pendingPayments) {
            if ("PENDING".equals(payment.getStatus()) && payment.getCreatedAt() != null && payment.getCreatedAt().isBefore(cutoff)) {
                System.out.println("Scheduler: Auto-cancelling expired payment ID " + payment.getId());
                
                payment.setStatus("FAILED");
                paymentRepository.save(payment);
                
                Bill bill = payment.getBill();
                if (bill != null) {
                    bill.setStatus("CANCELLED");
                    billRepository.save(bill);
                    
                    Appointment app = bill.getAppointment();
                    if (app != null) {
                        app.setStatus("CANCELLED");
                        appointmentRepository.save(app);
                        
                        AvailabilitySlot slot = app.getSlot();
                        if (slot != null) {
                            slot.setIsBooked(false);
                            availabilitySlotRepository.save(slot);
                            System.out.println("Scheduler: Slot " + slot.getId() + " is now free again.");
                        }
                    }
                }
            }
        }
    }
}
