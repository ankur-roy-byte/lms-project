package com.lms.dashboard;

import com.lms.course.Course;
import com.lms.course.CourseService;
import com.lms.enrollment.Enrollment;
import com.lms.enrollment.EnrollmentDTO;
import com.lms.enrollment.EnrollmentService;
import com.lms.payment.PaymentService;
import com.lms.session.LiveSession;
import com.lms.session.LiveSessionDTO;
import com.lms.session.LiveSessionService;
import com.lms.user.UserService;
import com.lms.user.UserRepository;
import com.lms.user.User;
import com.lms.certificate.CertificateService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final LiveSessionService liveSessionService;
    private final PaymentService paymentService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final CertificateService certificateService;

    @GetMapping
    public ResponseEntity<?> getDashboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String role = (String) claims.get("role");
        String userId = (String) claims.get("userId");

        Map<String, Object> dashboard = new HashMap<>();

        switch (role.toUpperCase()) {
            case "STUDENT":
                dashboard = getStudentDashboard(Long.parseLong(userId));
                break;
            case "INSTRUCTOR":
                dashboard = getInstructorDashboard(Long.parseLong(userId));
                break;
            case "ADMIN":
                dashboard = getAdminDashboard();
                break;
            default:
                return ResponseEntity.status(403).body(Map.of("error", "Unknown role"));
        }

        return ResponseEntity.ok(dashboard);
    }

    private Map<String, Object> getStudentDashboard(Long studentId) {
        Map<String, Object> dashboard = new HashMap<>();

        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
        List<EnrollmentDTO> enrollmentDTOs = enrollments.stream()
                .map(e -> EnrollmentDTO.builder()
                        .id(e.getId())
                        .studentId(e.getStudent().getId())
                        .courseId(e.getCourse().getId())
                        .courseTitle(e.getCourse().getTitle())
                        .courseThumbnail(e.getCourse().getThumbnailUrl())
                        .enrolledAt(e.getEnrolledAt())
                        .completed(e.getCompleted())
                        .completedAt(e.getCompletedAt())
                        .progressPercentage(enrollmentService.getProgressPercentage(e.getId()))
                        .build())
                .collect(Collectors.toList());

        List<LiveSession> upcomingSessions = liveSessionService.getUpcomingSessions().stream()
                .filter(s -> s.getScheduledAt().isAfter(LocalDateTime.now()))
                .limit(5)
                .collect(Collectors.toList());

        List<LiveSessionDTO> upcomingSessionDTOs = upcomingSessions.stream()
                .map(s -> LiveSessionDTO.builder()
                        .id(s.getId())
                        .courseId(s.getCourse().getId())
                        .courseTitle(s.getCourse().getTitle())
                        .instructorId(s.getInstructor().getId())
                        .instructorName(s.getInstructor().getName())
                        .title(s.getTitle())
                        .scheduledAt(s.getScheduledAt())
                        .durationMinutes(s.getDurationMinutes())
                        .build())
                .collect(Collectors.toList());

        int certificateCount = (int) certificateService.getStudentCertificates(studentId).stream().count();

        dashboard.put("enrolledCourses", enrollmentDTOs);
        dashboard.put("enrollmentCount", enrollmentDTOs.size());
        dashboard.put("upcomingSessions", upcomingSessionDTOs);
        dashboard.put("certificatesEarned", certificateCount);

        return dashboard;
    }

    private Map<String, Object> getInstructorDashboard(Long instructorId) {
        Map<String, Object> dashboard = new HashMap<>();

        List<Course> myCourses = courseService.getInstructorCourses(instructorId);
        long publishedCourses = myCourses.stream()
                .filter(Course::getPublished)
                .count();

        long totalStudents = myCourses.stream()
                .flatMap(course -> enrollmentService.getStudentEnrollments(instructorId).stream()
                        .filter(e -> e.getCourse().getId().equals(course.getId())))
                .map(Enrollment::getStudent)
                .distinct()
                .count();

        List<LiveSession> myUpcomingSessions = liveSessionService.getInstructorSessions(instructorId).stream()
                .filter(s -> s.getScheduledAt().isAfter(LocalDateTime.now()))
                .limit(5)
                .collect(Collectors.toList());

        List<LiveSessionDTO> upcomingSessionDTOs = myUpcomingSessions.stream()
                .map(s -> LiveSessionDTO.builder()
                        .id(s.getId())
                        .courseId(s.getCourse().getId())
                        .courseTitle(s.getCourse().getTitle())
                        .title(s.getTitle())
                        .scheduledAt(s.getScheduledAt())
                        .durationMinutes(s.getDurationMinutes())
                        .build())
                .collect(Collectors.toList());

        dashboard.put("totalCourses", myCourses.size());
        dashboard.put("publishedCourses", publishedCourses);
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("upcomingSessions", upcomingSessionDTOs);

        return dashboard;
    }

    private Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        long totalUsers = userService.getTotalUserCount();
        long totalInstructors = userService.getInstructorCount();
        long totalStudents = userService.getStudentCount();
        long totalCourses = courseService.getTotalCourseCount();
        long totalEnrollments = enrollmentService.getTotalEnrollmentCount();
        long totalPayments = paymentService.getTotalPaymentCount();
        BigDecimal totalRevenue = paymentService.getTotalRevenue();

        dashboard.put("totalUsers", totalUsers);
        dashboard.put("totalInstructors", totalInstructors);
        dashboard.put("totalStudents", totalStudents);
        dashboard.put("totalCourses", totalCourses);
        dashboard.put("totalEnrollments", totalEnrollments);
        dashboard.put("totalPayments", totalPayments);
        dashboard.put("totalRevenue", totalRevenue);

        return dashboard;
    }

}
