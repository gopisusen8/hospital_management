package com.hcl.DoctorAppointment.service;

import com.hcl.DoctorAppointment.model.Notification;
import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(User recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientId(userId);
    }

    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdAndIsRead(userId, false);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
