package com.hcl.DoctorAppointment.config;

import com.hcl.DoctorAppointment.model.Role;
import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DummyDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DummyDataLoader.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DummyDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Injecting dummy data...");

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .email("admin@hospital.com")
                    .role(Role.ROLE_ADMIN)
                    .firstName("Super")
                    .lastName("Admin")
                    .build();

            User doctor = User.builder()
                    .username("doctor")
                    .password(passwordEncoder.encode("doctor"))
                    .email("doctor@hospital.com")
                    .role(Role.ROLE_DOCTOR)
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            User patient = User.builder()
                    .username("patient")
                    .password(passwordEncoder.encode("patient"))
                    .email("patient@hospital.com")
                    .role(Role.ROLE_PATIENT)
                    .firstName("Jane")
                    .lastName("Smith")
                    .build();

            userRepository.save(admin);
            userRepository.save(doctor);
            userRepository.save(patient);

            logger.info("Dummy users injected successfully.");
        } else {
            logger.info("Database already contains data. Skipping dummy data injection.");
        }
    }
}
