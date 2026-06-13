package com.hcl.DoctorAppointment.controller;

import com.hcl.DoctorAppointment.model.User;
import com.hcl.DoctorAppointment.model.Role;
import com.hcl.DoctorAppointment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getPatients() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.ROLE_PATIENT)
                .collect(Collectors.toList());
    }
}
