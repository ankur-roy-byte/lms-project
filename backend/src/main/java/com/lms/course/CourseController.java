package com.lms.course;

import com.lms.user.User;
import com.lms.user.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<CourseDTO>> getPublishedCourses(Pageable pageable) {
        Page<Course> courses = courseService.getPublishedCourses(pageable);
        Page<CourseDTO> dtoPage = courses.map(this::convertToDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseDetail(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        if (course == null || !course.getPublished()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Course not found"));
        }
        return ResponseEntity.ok(convertToDTO(course));
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseDTO courseDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String role = (String) claims.get("role");

        if (!"INSTRUCTOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Only instructors can create courses")
            );
        }

        String userId = (String) claims.get("userId");
        User instructor = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (instructor == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        Course course = Course.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .price(courseDTO.getPrice())
                .thumbnailUrl(courseDTO.getThumbnailUrl())
                .category(courseDTO.getCategory())
                .instructor(instructor)
                .published(false)
                .build();

        Course created = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO courseDTO) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");
        String role = (String) claims.get("role");

        User currentUser = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        Course courseData = Course.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .price(courseDTO.getPrice())
                .thumbnailUrl(courseDTO.getThumbnailUrl())
                .category(courseDTO.getCategory())
                .published(courseDTO.getPublished())
                .build();

        Course updated = courseService.updateCourse(id, courseData, currentUser);
        if (updated == null) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized to update this course")
            );
        }

        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
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

        boolean deleted = courseService.deleteCourse(id, currentUser);
        if (!deleted) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized to delete this course")
            );
        }

        return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
    }

    @GetMapping("/{id}/lessons")
    public ResponseEntity<?> getCourseLessons(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Course not found"));
        }

        List<Lesson> lessons = courseService.getCourseLessons(id);
        List<LessonDTO> dtoList = lessons.stream()
                .map(this::convertLessonToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/{id}/lessons")
    public ResponseEntity<?> addLesson(
            @PathVariable Long id,
            @RequestBody LessonDTO lessonDTO) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");
        String role = (String) claims.get("role");

        if (!"INSTRUCTOR".equals(role) && !"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Only instructors can add lessons")
            );
        }

        User currentUser = userRepository.findById(Long.parseLong(userId)).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        Lesson lesson = Lesson.builder()
                .title(lessonDTO.getTitle())
                .description(lessonDTO.getDescription())
                .youtubeUrl(lessonDTO.getYoutubeUrl())
                .orderIndex(lessonDTO.getOrderIndex())
                .durationMinutes(lessonDTO.getDurationMinutes())
                .build();

        Lesson created = courseService.addLesson(id, lesson, currentUser);
        if (created == null) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized or course not found")
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(convertLessonToDTO(created));
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<?> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody LessonDTO lessonDTO) {

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

        Lesson lessonData = Lesson.builder()
                .title(lessonDTO.getTitle())
                .description(lessonDTO.getDescription())
                .youtubeUrl(lessonDTO.getYoutubeUrl())
                .orderIndex(lessonDTO.getOrderIndex())
                .durationMinutes(lessonDTO.getDurationMinutes())
                .build();

        Lesson updated = courseService.updateLesson(lessonId, lessonData, currentUser);
        if (updated == null) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized to update this lesson")
            );
        }

        return ResponseEntity.ok(convertLessonToDTO(updated));
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long lessonId) {
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

        boolean deleted = courseService.deleteLesson(lessonId, currentUser);
        if (!deleted) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "Not authorized to delete this lesson")
            );
        }

        return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully"));
    }

    private CourseDTO convertToDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .price(course.getPrice())
                .thumbnailUrl(course.getThumbnailUrl())
                .category(course.getCategory())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getName())
                .instructorEmail(course.getInstructor().getEmail())
                .published(course.getPublished())
                .createdAt(course.getCreatedAt())
                .build();
    }

    private LessonDTO convertLessonToDTO(Lesson lesson) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .youtubeUrl(lesson.getYoutubeUrl())
                .orderIndex(lesson.getOrderIndex())
                .durationMinutes(lesson.getDurationMinutes())
                .build();
    }

}
