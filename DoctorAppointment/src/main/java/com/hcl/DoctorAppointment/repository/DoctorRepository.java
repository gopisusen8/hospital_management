package com.hcl.DoctorAppointment.repository;

import com.hcl.DoctorAppointment.model.Doctor;
import com.hcl.DoctorAppointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByDepartment(String department);
}
