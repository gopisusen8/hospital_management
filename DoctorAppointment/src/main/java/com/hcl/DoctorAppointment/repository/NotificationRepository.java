package com.hcl.DoctorAppointment.repository;

import com.hcl.DoctorAppointment.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientId(Long recipientId);
    List<Notification> findByRecipientIdAndIsRead(Long recipientId, Boolean isRead);
}
