package com.lms.config;

import com.lms.user.User;
import com.lms.user.UserRepository;
import com.lms.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        createDemoUserIfNotExists("Admin User", "admin@zenved.com", UserRole.ADMIN);
        createDemoUserIfNotExists("Instructor Demo", "instructor@zenved.com", UserRole.INSTRUCTOR);
        createDemoUserIfNotExists("Student Demo", "student@zenved.com", UserRole.STUDENT);
        log.info("Demo users seeded successfully");
    }

    private void createDemoUserIfNotExists(String name, String email, UserRole role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .role(role)
                    .build();
            userRepository.save(user);
            log.info("Created demo user: {} ({})", email, role);
        }
    }
}
