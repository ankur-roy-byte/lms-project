package com.lms.enrollment;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
import com.lms.course.Lesson;
import com.lms.course.LessonRepository;
import com.lms.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public Enrollment enrollStudent(User student, Long courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            return enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).orElse(null);
        }

        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return null;
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .completed(false)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        log.info("Student {} enrolled in course {}", student.getId(), courseId);
        return saved;
    }

    public List<Enrollment> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public Enrollment getEnrollment(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId).orElse(null);
    }

    public boolean markLessonComplete(Long enrollmentId, Long lessonId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);
        if (enrollment == null) {
            return false;
        }

        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return false;
        }

        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollmentId, lessonId)
                .orElse(null);

        if (progress == null) {
            progress = LessonProgress.builder()
                    .enrollment(enrollment)
                    .lesson(lesson)
                    .completedAt(LocalDateTime.now())
                    .build();
            lessonProgressRepository.save(progress);
        } else if (progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
            lessonProgressRepository.save(progress);
        }

        log.info("Lesson {} marked complete for enrollment {}", lessonId, enrollmentId);
        return true;
    }

    public int getProgressPercentage(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);
        if (enrollment == null) {
            return 0;
        }

        List<Lesson> lessons = lessonRepository.findByCourseId(enrollment.getCourse().getId());
        if (lessons.isEmpty()) {
            return 100;
        }

        int completedCount = lessonProgressRepository.countByEnrollmentIdAndCompletedAtNotNull(enrollmentId);
        return (int) ((double) completedCount / lessons.size() * 100);
    }

    public boolean isEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    public long getTotalEnrollmentCount() {
        return enrollmentRepository.count();
    }

}
