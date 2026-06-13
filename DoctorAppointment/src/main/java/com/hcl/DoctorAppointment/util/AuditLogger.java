package com.hcl.DoctorAppointment.util;

import com.hcl.DoctorAppointment.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuditLogger {

    @Autowired
    private AuditService auditService;

    @Autowired
    private HttpServletRequest request;

    public void log(String actor, String action, String details) {
        String ipAddress = request.getRemoteAddr();
        auditService.log(actor, action, details, ipAddress);
    }
}
