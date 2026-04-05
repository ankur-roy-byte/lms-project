package com.lms.course;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Page<Course> findByPublishedTrue(Pageable pageable);

    List<Course> findByInstructorId(Long instructorId);

    List<Course> findByInstructorIdAndPublishedTrue(Long instructorId);

}
