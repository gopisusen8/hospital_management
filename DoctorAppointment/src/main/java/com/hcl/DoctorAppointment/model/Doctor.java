package com.hcl.DoctorAppointment.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String specialization;

    private String department;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    private Double rating;
}
