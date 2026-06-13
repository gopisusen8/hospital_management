package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.Notification;
import com.hcl.DoctorAppointment.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsForUser(@PathVariable Long userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotificationsForUser(@PathVariable Long userId) {
        return notificationService.getUnreadNotificationsForUser(userId);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
