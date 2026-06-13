package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.AuditLog;
import com.hcl.DoctorAppointment.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String actor, String action, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .actor(actor)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}
