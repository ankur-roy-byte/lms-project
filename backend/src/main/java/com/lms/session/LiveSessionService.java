package com.lms.session;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
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
public class LiveSessionService {

    private final LiveSessionRepository liveSessionRepository;
    private final CourseRepository courseRepository;

    public List<LiveSession> getUpcomingSessions() {
        return liveSessionRepository.findByScheduledAtAfterOrderByScheduledAt(LocalDateTime.now());
    }

    public List<LiveSession> getSessionsForCourse(Long courseId) {
        return liveSessionRepository.findByCourseIdOrderByScheduledAt(courseId);
    }

    public List<LiveSession> getInstructorSessions(Long instructorId) {
        return liveSessionRepository.findByInstructorIdOrderByScheduledAt(instructorId);
    }

    public LiveSession getSessionById(Long id) {
        return liveSessionRepository.findById(id).orElse(null);
    }

    public LiveSession createSession(LiveSession session) {
        LiveSession saved = liveSessionRepository.save(session);
        log.info("Live session {} created for course {}", saved.getId(), session.getCourse().getId());
        return saved;
    }

    public LiveSession updateSession(Long id, LiveSession sessionData, User currentUser) {
        LiveSession session = liveSessionRepository.findById(id).orElse(null);
        if (session == null) {
            return null;
        }

        if (!session.getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return null;
        }

        if (sessionData.getTitle() != null) {
            session.setTitle(sessionData.getTitle());
        }
        if (sessionData.getDescription() != null) {
            session.setDescription(sessionData.getDescription());
        }
        if (sessionData.getMeetingLink() != null) {
            session.setMeetingLink(sessionData.getMeetingLink());
        }
        if (sessionData.getScheduledAt() != null) {
            session.setScheduledAt(sessionData.getScheduledAt());
        }
        if (sessionData.getDurationMinutes() != null) {
            session.setDurationMinutes(sessionData.getDurationMinutes());
        }
        if (sessionData.getActive() != null) {
            session.setActive(sessionData.getActive());
        }

        LiveSession updated = liveSessionRepository.save(session);
        log.info("Live session {} updated", id);
        return updated;
    }

    public boolean deleteSession(Long id, User currentUser) {
        LiveSession session = liveSessionRepository.findById(id).orElse(null);
        if (session == null) {
            return false;
        }

        if (!session.getInstructor().getId().equals(currentUser.getId()) &&
                !"ADMIN".equals(currentUser.getRole().toString())) {
            return false;
        }

        liveSessionRepository.delete(session);
        log.info("Live session {} deleted", id);
        return true;
    }

}
