package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.dto.request.PaymentConfirmRequest;
import com.hcl.DoctorAppointment.model.Payment;
import com.hcl.DoctorAppointment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate/{billId}")
    public ResponseEntity<Payment> initiatePayment(@PathVariable Long billId, @RequestParam String method) {
        return ResponseEntity.ok(paymentService.initiatePayment(billId, method));
    }

    @PostMapping("/confirm/{paymentId}")
    public ResponseEntity<Payment> confirmPayment(
            @PathVariable Long paymentId,
            @RequestBody PaymentConfirmRequest confirmRequest) {
        return ResponseEntity.ok(paymentService.confirmPayment(paymentId, confirmRequest.getTransactionId()));
    }
}
