package com.lms.user;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers(Pageable pageable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Forbidden")
            );
        }

        Claims claims = (Claims) detailsObj;
        String role = (String) claims.get("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Only ADMIN can view users")
            );
        }

        Page<User> users = userService.getAllUsers(pageable);
        Page<UserDTO> dtoPage = users.map(user -> UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().toString())
                .createdAt(user.getCreatedAt())
                .build());

        return ResponseEntity.ok(dtoPage);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Forbidden")
            );
        }

        Claims claims = (Claims) detailsObj;
        String role = (String) claims.get("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Only ADMIN can update roles")
            );
        }

        String roleStr = request.get("role");
        if (roleStr == null || roleStr.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Missing role field")
            );
        }

        try {
            UserRole newRole = UserRole.valueOf(roleStr.toUpperCase());
            User updatedUser = userService.updateUserRole(id, newRole);

            if (updatedUser == null) {
                return ResponseEntity.status(404).body(
                        Map.of("error", "User not found")
                );
            }

            UserDTO userDTO = UserDTO.builder()
                    .id(updatedUser.getId())
                    .name(updatedUser.getName())
                    .email(updatedUser.getEmail())
                    .avatarUrl(updatedUser.getAvatarUrl())
                    .role(updatedUser.getRole().toString())
                    .createdAt(updatedUser.getCreatedAt())
                    .build();

            return ResponseEntity.ok(userDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid role: " + roleStr)
            );
        }
    }

}
