package com.lms.quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findByLessonId(Long lessonId);

    Optional<Quiz> findByIdAndIsFinalTrue(Long id);

    List<Quiz> findByCourseId(Long courseId);

    Optional<Quiz> findByCourseIdAndIsFinalTrue(Long courseId);

}
