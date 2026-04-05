package com.lms.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User updateUserRole(Long id, UserRole role) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setRole(role);
            user = userRepository.save(user);
            log.info("User {} role updated to {}", id, role);
        }
        return user;
    }

    public long getTotalUserCount() {
        return userRepository.count();
    }

    public long getInstructorCount() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.INSTRUCTOR)
                .count();
    }

    public long getStudentCount() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.STUDENT)
                .count();
    }

}
