package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Payment;
import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.repository.PaymentRepository;
import com.hcl.DoctorAppointment.repository.BillRepository;
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

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Payment initiatePayment(Long billId, String method) {
        Optional<Bill> billOpt = billRepository.findById(billId);
        if (billOpt.isEmpty()) {
            throw new RuntimeException("Bill not found");
        }

        Bill bill = billOpt.get();
        Payment payment = Payment.builder()
                .bill(bill)
                .amount(bill.getAmount() + bill.getTax() - bill.getDiscount())
                .paymentMethod(method)
                .status("PENDING")
                .qrCodeUrl("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI:" + UUID.randomUUID())
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

        return paymentRepository.save(payment);
    }
}
