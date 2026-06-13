package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.AuditLog;
import com.hcl.DoctorAppointment.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AuditService auditService;

    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return auditService.getAllLogs();
    }

    @GetMapping("/occupancy-stats")
    public Map<String, Object> getOccupancyStats() {
        // Dummy statistics mapping
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBeds", 150);
        stats.put("occupiedBeds", 98);
        stats.put("occupancyPercentage", 65.33);
        stats.put("icuOccupied", 12);
        stats.put("emergencyOccupied", 8);
        return stats;
    }
}
