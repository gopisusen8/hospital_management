package com.hcl.DoctorAppointment.config;

import com.hcl.DoctorAppointment.model.*;
import com.hcl.DoctorAppointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRecordRepository recordRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping seeder...");
            return;
        }

        System.out.println("Seeding database with mock data...");

        // 1. Create Users
        User patientUser = User.builder()
                .username("patient1")
                .password(passwordEncoder.encode("password123"))
                .email("patient1@careflow.com")
                .role(Role.ROLE_PATIENT)
                .firstName("John")
                .lastName("Doe")
                .phone("+15551234567")
                .build();
        userRepository.save(patientUser);

        User doctorUser = User.builder()
                .username("doctor1")
                .password(passwordEncoder.encode("password123"))
                .email("doctor1@careflow.com")
                .role(Role.ROLE_DOCTOR)
                .firstName("Sarah")
                .lastName("Jenkins")
                .phone("+15557654321")
                .build();
        userRepository.save(doctorUser);

        User adminUser = User.builder()
                .username("admin1")
                .password(passwordEncoder.encode("password123"))
                .email("admin1@careflow.com")
                .role(Role.ROLE_ADMIN)
                .firstName("System")
                .lastName("Admin")
                .phone("+15559990000")
                .build();
        userRepository.save(adminUser);

        // 2. Create Doctor Profile
        Doctor doctor = Doctor.builder()
                .user(doctorUser)
                .specialization("Cardiology")
                .department("Cardiology Center")
                .bio("Specialist in cardiovascular diseases and interventional cardiology with over 12 years of experience.")
                .consultationFee(150.0)
                .rating(4.9)
                .build();
        doctorRepository.save(doctor);

        // 3. Create Slots
        AvailabilitySlot slot1 = AvailabilitySlot.builder()
                .doctor(doctor)
                .startDateTime(LocalDateTime.now().plusDays(2).withHour(9).withMinute(0).withSecond(0).withNano(0))
                .endDateTime(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0).withSecond(0).withNano(0))
                .isBooked(false)
                .build();
        slotRepository.save(slot1);

        AvailabilitySlot slot2 = AvailabilitySlot.builder()
                .doctor(doctor)
                .startDateTime(LocalDateTime.now().plusDays(2).withHour(10).withMinute(30).withSecond(0).withNano(0))
                .endDateTime(LocalDateTime.now().plusDays(2).withHour(11).withMinute(30).withSecond(0).withNano(0))
                .isBooked(false)
                .build();
        slotRepository.save(slot2);

        AvailabilitySlot slot3 = AvailabilitySlot.builder()
                .doctor(doctor)
                .startDateTime(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0).withSecond(0).withNano(0))
                .endDateTime(LocalDateTime.now().plusDays(3).withHour(15).withMinute(0).withSecond(0).withNano(0))
                .isBooked(true) // Pre-booked slot
                .build();
        slotRepository.save(slot3);

        // 4. Create Pre-booked Appointment
        Appointment appointment = Appointment.builder()
                .patient(patientUser)
                .doctor(doctor)
                .slot(slot3)
                .status("CONFIRMED")
                .reason("Routine cardiovascular follow-up")
                .build();
        appointmentRepository.save(appointment);

        // 5. Create Clinical Record History
        PatientRecord record = PatientRecord.builder()
                .patient(patientUser)
                .doctor(doctor)
                .visitDate(LocalDate.now().minusMonths(1))
                .diagnosis("Mild Hypertension")
                .notes("Patient has slightly elevated blood pressure. Recommended reduction in sodium intake and routine exercise. Prescribed Lisinopril.")
                .build();
        recordRepository.save(record);

        // 6. Create Bill
        Bill bill = Bill.builder()
                .patient(patientUser)
                .appointment(appointment)
                .amount(150.0)
                .tax(12.0)
                .discount(0.0)
                .status("UNPAID")
                .dueDate(LocalDate.now().plusDays(7))
                .build();
        billRepository.save(bill);

        System.out.println("Seeding database completed successfully!");
    }
}
