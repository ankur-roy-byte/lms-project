package com.lms.enrollment;

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
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;

    @PostMapping("/enroll")
    public ResponseEntity<?> enrollInCourse(@RequestBody Map<String, Long> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        User student = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (student == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        Long courseId = request.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing courseId"));
        }

        Enrollment enrollment = enrollmentService.enrollStudent(student, courseId);
        if (enrollment == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Course not found"));
        }

        EnrollmentDTO dto = convertToDTO(enrollment, enrollmentService);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/enrollments")
    public ResponseEntity<?> getMyEnrollments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(Long.parseLong(userId));
        List<EnrollmentDTO> dtoList = enrollments.stream()
                .map(e -> convertToDTO(e, enrollmentService))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/progress")
    public ResponseEntity<?> markLessonComplete(@RequestBody Map<String, Long> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Long enrollmentId = request.get("enrollmentId");
        Long lessonId = request.get("lessonId");

        if (enrollmentId == null || lessonId == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Missing enrollmentId or lessonId")
            );
        }

        boolean marked = enrollmentService.markLessonComplete(enrollmentId, lessonId);
        if (!marked) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "Enrollment or lesson not found")
            );
        }

        Enrollment enrollment = enrollmentService.getEnrollment(enrollmentId);
        return ResponseEntity.ok(Map.of(
                "message", "Lesson marked as complete",
                "progressPercentage", enrollmentService.getProgressPercentage(enrollmentId)
        ));
    }

    @GetMapping("/progress/{courseId}")
    public ResponseEntity<?> getProgressForCourse(@PathVariable Long courseId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        Enrollment enrollment = enrollmentService.getStudentEnrollments(Long.parseLong(userId))
                .stream()
                .filter(e -> e.getCourse().getId().equals(courseId))
                .findFirst()
                .orElse(null);

        if (enrollment == null) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "Not enrolled in this course")
            );
        }

        int progressPercentage = enrollmentService.getProgressPercentage(enrollment.getId());
        return ResponseEntity.ok(Map.of(
                "enrollmentId", enrollment.getId(),
                "courseId", courseId,
                "progressPercentage", progressPercentage,
                "completed", enrollment.getCompleted()
        ));
    }

    private EnrollmentDTO convertToDTO(Enrollment enrollment, EnrollmentService service) {
        return EnrollmentDTO.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .courseThumbnail(enrollment.getCourse().getThumbnailUrl())
                .enrolledAt(enrollment.getEnrolledAt())
                .completed(enrollment.getCompleted())
                .completedAt(enrollment.getCompletedAt())
                .progressPercentage(service.getProgressPercentage(enrollment.getId()))
                .build();
    }

}
