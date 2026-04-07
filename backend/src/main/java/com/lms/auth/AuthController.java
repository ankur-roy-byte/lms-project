package com.lms.auth;

import com.lms.user.User;
import com.lms.user.UserDTO;
import com.lms.user.UserRepository;
import com.lms.user.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/demo-login")
    public ResponseEntity<?> demoLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }

        // Simple demo credential check: password must equal the part before @
        String expectedPassword = email.split("@")[0];
        if (!password.equals(expectedPassword)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(token)
                        .user(userDTO)
                        .message("Demo login successful")
                        .build()
        );
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        String tokenId = request.get("tokenId");

        if (tokenId == null || tokenId.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Missing tokenId")
            );
        }

        GoogleTokenInfo tokenInfo = googleTokenVerifier.verifyToken(tokenId);

        if (tokenInfo == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid Google token")
            );
        }

        User user = userRepository.findByGoogleId(tokenInfo.getGoogleId()).orElse(null);

        if (user == null) {
            user = User.builder()
                    .name(tokenInfo.getName())
                    .email(tokenInfo.getEmail())
                    .googleId(tokenInfo.getGoogleId())
                    .avatarUrl(tokenInfo.getAvatarUrl())
                    .role(UserRole.STUDENT)
                    .build();
            user = userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(token)
                        .user(userDTO)
                        .message("Login successful")
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(
                    Map.of("error", "Unauthorized")
            );
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "User not found")
            );
        }

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

}
