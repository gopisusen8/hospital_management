package com.hcl.DoctorAppointment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod; // CARD, UPI, CASH

    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, FAILED

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
