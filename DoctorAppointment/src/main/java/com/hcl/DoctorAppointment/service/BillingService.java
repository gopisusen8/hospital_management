package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Bill;
import com.hcl.DoctorAppointment.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    @Autowired
    private BillRepository billRepository;

    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Bill createBill(Bill bill) {
        bill.setStatus("UNPAID");
        return billRepository.save(bill);
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }
}
