package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @GetMapping("/patient/{patientId}")
    public List<Bill> getBillsByPatient(@PathVariable Long patientId) {
        return billingService.getBillsByPatient(patientId);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billingService.getAllBills();
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.createBill(bill));
    }
}
