package com.lms.session;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
import com.lms.user.User;
import com.lms.user.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class LiveSessionController {

    private final LiveSessionService liveSessionService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LiveSessionDTO>> getUpcomingSessions() {
        List<LiveSession> sessions = liveSessionService.getUpcomingSessions();
        List<LiveSessionDTO> dtoList = sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LiveSessionDTO>> getSessionsForCourse(@PathVariable Long courseId) {
        List<LiveSession> sessions = liveSessionService.getSessionsForCourse(courseId);
        List<LiveSessionDTO> dtoList = sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody LiveSessionDTO sessionDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String role = (String) claims.get("role");
        String userId = (String) claims.get("userId");

        if (!"INSTRUCTOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Only instructors can create sessions")
            );
        }

        Course course = courseRepository.findById(sessionDTO.getCourseId()).orElse(null);
        User instructor = userRepository.findById(Long.parseLong(userId)).orElse(null);

        if (course == null || instructor == null) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "Course or instructor not found")
            );
        }

        LiveSession session = LiveSession.builder()
                .course(course)
                .instructor(instructor)
                .title(sessionDTO.getTitle())
                .description(sessionDTO.getDescription())
                .meetingLink(sessionDTO.getMeetingLink())
                .scheduledAt(sessionDTO.getScheduledAt())
                .durationMinutes(sessionDTO.getDurationMinutes())
                .active(false)
                .build();

        LiveSession created = liveSessionService.createSession(session);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(
            @PathVariable Long id,
            @RequestBody LiveSessionDTO sessionDTO) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        User currentUser = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        LiveSession sessionData = LiveSession.builder()
                .title(sessionDTO.getTitle())
                .description(sessionDTO.getDescription())
                .meetingLink(sessionDTO.getMeetingLink())
                .scheduledAt(sessionDTO.getScheduledAt())
                .durationMinutes(sessionDTO.getDurationMinutes())
                .active(sessionDTO.getActive())
                .build();

        LiveSession updated = liveSessionService.updateSession(id, sessionData, currentUser);
        if (updated == null) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized or session not found")
            );
        }

        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        User currentUser = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        boolean deleted = liveSessionService.deleteSession(id, currentUser);
        if (!deleted) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized or session not found")
            );
        }

        return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
    }

    private LiveSessionDTO convertToDTO(LiveSession session) {
        return LiveSessionDTO.builder()
                .id(session.getId())
                .courseId(session.getCourse().getId())
                .courseTitle(session.getCourse().getTitle())
                .instructorId(session.getInstructor().getId())
                .instructorName(session.getInstructor().getName())
                .title(session.getTitle())
                .description(session.getDescription())
                .meetingLink(session.getMeetingLink())
                .scheduledAt(session.getScheduledAt())
                .durationMinutes(session.getDurationMinutes())
                .active(session.getActive())
                .build();
    }

}
