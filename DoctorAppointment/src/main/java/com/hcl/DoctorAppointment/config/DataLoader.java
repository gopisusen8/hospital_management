package com.hcl.DoctorAppointment.config;

import com.hcl.DoctorAppointment.model.*;
import com.hcl.DoctorAppointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already contains user records. Skipping seeding.");
            return;
        }

        System.out.println("Seeding database with default users, doctors, and slots...");

        // Create Patient Users
        User p1 = User.builder()
                .username("patient1")
                .password(passwordEncoder.encode("password"))
                .email("patient1@careflow.com")
                .role(Role.ROLE_PATIENT)
                .firstName("John")
                .lastName("Doe")
                .phone("1234567890")
                .build();
        userRepository.save(p1);

        User p2 = User.builder()
                .username("patient2")
                .password(passwordEncoder.encode("password"))
                .email("patient2@careflow.com")
                .role(Role.ROLE_PATIENT)
                .firstName("Jane")
                .lastName("Smith")
                .phone("0987654321")
                .build();
        userRepository.save(p2);

        // Create Admin User
        User adminUser = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("password"))
                .email("admin@careflow.com")
                .role(Role.ROLE_ADMIN)
                .firstName("Hospital")
                .lastName("Administrator")
                .phone("1112223333")
                .build();
        userRepository.save(adminUser);

        // Create Doctor 1
        User d1User = User.builder()
                .username("doctor1")
                .password(passwordEncoder.encode("password"))
                .email("jenkins@careflow.com")
                .role(Role.ROLE_DOCTOR)
                .firstName("Sarah")
                .lastName("Jenkins")
                .phone("5551112222")
                .build();

        Doctor d1 = Doctor.builder()
                .user(d1User)
                .specialization("Cardiology")
                .department("Cardiology Center")
                .consultationFee(150.0)
                .rating(4.9)
                .bio("Expert cardiologist with 10+ years experience in interventional cardiology and cardiovascular care.")
                .build();
        doctorRepository.save(d1);

        // Create Doctor 2
        User d2User = User.builder()
                .username("doctor2")
                .password(passwordEncoder.encode("password"))
                .email("vance@careflow.com")
                .role(Role.ROLE_DOCTOR)
                .firstName("Marcus")
                .lastName("Vance")
                .phone("5553334444")
                .build();

        Doctor d2 = Doctor.builder()
                .user(d2User)
                .specialization("Neurology")
                .department("Neurology & Brain Center")
                .consultationFee(200.0)
                .rating(4.8)
                .bio("Renowned neurologist specializing in cognitive disorders, neurological mapping, and brain therapies.")
                .build();
        doctorRepository.save(d2);

        // Create Doctor 3
        User d3User = User.builder()
                .username("doctor3")
                .password(passwordEncoder.encode("password"))
                .email("patel@careflow.com")
                .role(Role.ROLE_DOCTOR)
                .firstName("Anita")
                .lastName("Patel")
                .phone("5555556666")
                .build();

        Doctor d3 = Doctor.builder()
                .user(d3User)
                .specialization("Pediatrics")
                .department("Children Health Wing")
                .consultationFee(100.0)
                .rating(4.95)
                .bio("Compassionate pediatrician loved by families, focusing on developmental health and preventive child care.")
                .build();
        doctorRepository.save(d3);

        // Seed Availability Slots
        LocalDateTime baseTime = LocalDateTime.now().withHour(9).withMinute(0).withSecond(0).withNano(0).plusDays(1);

        // Doctor 1 Slots
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d1).startDateTime(baseTime).endDateTime(baseTime.plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d1).startDateTime(baseTime.plusHours(1)).endDateTime(baseTime.plusHours(1).plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d1).startDateTime(baseTime.plusDays(1)).endDateTime(baseTime.plusDays(1).plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d1).startDateTime(baseTime.plusDays(2)).endDateTime(baseTime.plusDays(2).plusMinutes(30)).isBooked(false).build());

        // Doctor 2 Slots
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d2).startDateTime(baseTime.plusMinutes(30)).endDateTime(baseTime.plusHours(1)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d2).startDateTime(baseTime.plusHours(2)).endDateTime(baseTime.plusHours(2).plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d2).startDateTime(baseTime.plusDays(1).plusHours(2)).endDateTime(baseTime.plusDays(1).plusHours(2).plusMinutes(30)).isBooked(false).build());

        // Doctor 3 Slots
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d3).startDateTime(baseTime.plusHours(3)).endDateTime(baseTime.plusHours(3).plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d3).startDateTime(baseTime.plusHours(4)).endDateTime(baseTime.plusHours(4).plusMinutes(30)).isBooked(false).build());
        availabilitySlotRepository.save(AvailabilitySlot.builder().doctor(d3).startDateTime(baseTime.plusDays(2).plusHours(1)).endDateTime(baseTime.plusDays(2).plusHours(1).plusMinutes(30)).isBooked(false).build());

        System.out.println("Seeding completed successfully.");
    }
}
