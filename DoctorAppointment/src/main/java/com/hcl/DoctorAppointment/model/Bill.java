package com.hcl.DoctorAppointment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(nullable = false)
    private Double amount;

    private Double tax = 0.0;

    private Double discount = 0.0;

    @Column(nullable = false)
    private String status; // UNPAID, PAID, CANCELLED

    @Column(name = "due_date")
    private LocalDate dueDate;
}
