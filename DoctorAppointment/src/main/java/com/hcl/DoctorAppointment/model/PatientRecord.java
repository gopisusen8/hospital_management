package com.hcl.DoctorAppointment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.hcl.DoctorAppointment.util.CryptoConverter;

@Entity
@Table(name = "patient_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Convert(converter = CryptoConverter.class)
    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Convert(converter = CryptoConverter.class)
    @Column(columnDefinition = "TEXT")
    private String notes;
}
