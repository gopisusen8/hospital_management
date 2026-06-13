package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.dto.request.LoginRequest;
import com.hcl.DoctorAppointment.dto.response.JwtResponse;
import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.repository.UserRepository;
import com.hcl.DoctorAppointment.config.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User lookup failed after authentication");
        }
        User user = userOpt.get();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        ));
    }

    @Autowired
    private com.hcl.DoctorAppointment.repository.DoctorRepository doctorRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User signUpUser) {
        if (userRepository.existsByUsername(signUpUser.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpUser.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        signUpUser.setPassword(passwordEncoder.encode(signUpUser.getPassword()));
        User result = userRepository.save(signUpUser);

        if (result.getRole() == com.hcl.DoctorAppointment.model.Role.ROLE_DOCTOR) {
            com.hcl.DoctorAppointment.model.Doctor doctor = com.hcl.DoctorAppointment.model.Doctor.builder()
                    .user(result)
                    .specialization("General Medicine")
                    .department("General Outpatient")
                    .consultationFee(100.0)
                    .rating(5.0)
                    .build();
            doctorRepository.save(doctor);
        }

        return ResponseEntity.ok("User registered successfully");
    }
}
