package com.lms.course;

import com.lms.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public Page<Course> getPublishedCourses(Pageable pageable) {
        return courseRepository.findByPublishedTrue(pageable);
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course createCourse(Course course) {
        course.setPublished(false);
        Course saved = courseRepository.save(course);
        log.info("Course {} created by instructor {}", saved.getId(), course.getInstructor().getId());
        return saved;
    }

    public Course updateCourse(Long id, Course courseData, User currentUser) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return null;
        }

        if (!course.getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return null;
        }

        if (courseData.getTitle() != null) {
            course.setTitle(courseData.getTitle());
        }
        if (courseData.getDescription() != null) {
            course.setDescription(courseData.getDescription());
        }
        if (courseData.getPrice() != null) {
            course.setPrice(courseData.getPrice());
        }
        if (courseData.getThumbnailUrl() != null) {
            course.setThumbnailUrl(courseData.getThumbnailUrl());
        }
        if (courseData.getCategory() != null) {
            course.setCategory(courseData.getCategory());
        }
        if (courseData.getPublished() != null) {
            course.setPublished(courseData.getPublished());
        }

        Course updated = courseRepository.save(course);
        log.info("Course {} updated", id);
        return updated;
    }

    public boolean deleteCourse(Long id, User currentUser) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null) {
            return false;
        }

        if (!course.getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return false;
        }

        lessonRepository.deleteAll(lessonRepository.findByCourseId(id));
        courseRepository.delete(course);
        log.info("Course {} deleted", id);
        return true;
    }

    public List<Course> getInstructorCourses(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public List<Course> getPublishedInstructorCourses(Long instructorId) {
        return courseRepository.findByInstructorIdAndPublishedTrue(instructorId);
    }

    public long getTotalCourseCount() {
        return courseRepository.count();
    }

    public Lesson addLesson(Long courseId, Lesson lesson, User currentUser) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return null;
        }

        if (!course.getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return null;
        }

        lesson.setCourse(course);
        Lesson saved = lessonRepository.save(lesson);
        log.info("Lesson {} added to course {}", saved.getId(), courseId);
        return saved;
    }

    public List<Lesson> getCourseLessons(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndex(courseId);
    }

    public Lesson updateLesson(Long lessonId, Lesson lessonData, User currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return null;
        }

        if (!lesson.getCourse().getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return null;
        }

        if (lessonData.getTitle() != null) {
            lesson.setTitle(lessonData.getTitle());
        }
        if (lessonData.getDescription() != null) {
            lesson.setDescription(lessonData.getDescription());
        }
        if (lessonData.getYoutubeUrl() != null) {
            lesson.setYoutubeUrl(lessonData.getYoutubeUrl());
        }
        if (lessonData.getOrderIndex() != null) {
            lesson.setOrderIndex(lessonData.getOrderIndex());
        }
        if (lessonData.getDurationMinutes() != null) {
            lesson.setDurationMinutes(lessonData.getDurationMinutes());
        }

        Lesson updated = lessonRepository.save(lesson);
        log.info("Lesson {} updated", lessonId);
        return updated;
    }

    public boolean deleteLesson(Long lessonId, User currentUser) {
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) {
            return false;
        }

        if (!lesson.getCourse().getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return false;
        }

        lessonRepository.delete(lesson);
        log.info("Lesson {} deleted", lessonId);
        return true;
    }

}
