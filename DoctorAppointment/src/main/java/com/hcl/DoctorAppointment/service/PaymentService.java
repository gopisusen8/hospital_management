package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Payment;
import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.model.Appointment;
import com.hcl.DoctorAppointment.repository.PaymentRepository;
import com.hcl.DoctorAppointment.repository.BillRepository;
import com.hcl.DoctorAppointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Payment initiatePayment(Long billId, String method) {
        Optional<Bill> billOpt = billRepository.findById(billId);
        if (billOpt.isEmpty()) {
            throw new RuntimeException("Bill not found");
        }

        Bill bill = billOpt.get();
        double finalAmount = bill.getAmount() + bill.getTax() - bill.getDiscount();
        
        // Generate QR code URL encoding amount and bill/appointment identifiers
        String data = "UPI:pay?pa=careflow@hdfc&am=" + finalAmount + "&tr=" + bill.getId() + "&tn=Appointment-" + (bill.getAppointment() != null ? bill.getAppointment().getId() : "None");
        String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + java.net.URLEncoder.encode(data, java.nio.charset.StandardCharsets.UTF_8);

        Payment payment = Payment.builder()
                .bill(bill)
                .amount(finalAmount)
                .paymentMethod(method)
                .status("PENDING")
                .qrCodeUrl(qrUrl)
                .build();

        return paymentRepository.save(payment);
    }

    public Payment confirmPayment(Long paymentId, String transactionId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            throw new RuntimeException("Payment record not found");
        }

        Payment payment = paymentOpt.get();
        payment.setStatus("COMPLETED");
        payment.setTransactionId(transactionId);
        payment.setPaidAt(LocalDateTime.now());

        Bill bill = payment.getBill();
        bill.setStatus("PAID");
        billRepository.save(bill);

        Appointment app = bill.getAppointment();
        if (app != null) {
            app.setStatus("Confirmed");
            appointmentRepository.save(app);
        }

        return paymentRepository.save(payment);
    }
}
