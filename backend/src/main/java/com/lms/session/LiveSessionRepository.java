package com.lms.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LiveSessionRepository extends JpaRepository<LiveSession, Long> {

    List<LiveSession> findByScheduledAtAfterOrderByScheduledAt(LocalDateTime dateTime);

    List<LiveSession> findByCourseIdOrderByScheduledAt(Long courseId);

    List<LiveSession> findByInstructorIdOrderByScheduledAt(Long instructorId);

}
