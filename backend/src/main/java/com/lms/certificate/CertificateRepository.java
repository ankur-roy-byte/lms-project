package com.lms.certificate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);

    List<Certificate> findByStudentId(Long studentId);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

}
