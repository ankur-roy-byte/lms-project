package com.lms.certificate;

import com.lms.course.CourseRepository;
import com.lms.user.User;
import com.lms.user.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @PostMapping("/generate/{courseId}")
    public ResponseEntity<?> generateCertificate(@PathVariable Long courseId) {
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

        if (!certificateService.isEligibleForCertificate(student.getId(), courseId)) {
            return ResponseEntity.status(403).body(
                    Map.of("error", "You are not eligible for a certificate yet")
            );
        }

        Certificate certificate = certificateService.generateCertificate(student.getId(), courseId);
        if (certificate == null) {
            return ResponseEntity.status(400).body(
                    Map.of("error", "Failed to generate certificate")
            );
        }

        CertificateDTO dto = CertificateDTO.builder()
                .id(certificate.getId())
                .studentId(certificate.getStudent().getId())
                .studentName(certificate.getStudent().getName())
                .courseId(certificate.getCourse().getId())
                .courseTitle(certificate.getCourse().getTitle())
                .certificateNumber(certificate.getCertificateNumber())
                .issuedAt(certificate.getIssuedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/download/{certificateId}")
    public ResponseEntity<?> downloadCertificate(@PathVariable Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId).orElse(null);
        if (certificate == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Certificate not found"));
        }

        try {
            User student = certificate.getStudent();
            User courseInstructor = certificate.getCourse().getInstructor();

            File pdfFile = certificateService.generateCertificatePDF(certificateId, student, certificate.getCourse());

            Resource resource = new FileSystemResource(pdfFile);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfFile.getName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            log.error("Error generating certificate PDF: {}", e.getMessage());
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to generate PDF")
            );
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyCertificates() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        List<Certificate> certificates = certificateService.getStudentCertificates(Long.parseLong(userId));
        List<CertificateDTO> dtoList = certificates.stream()
                .map(cert -> CertificateDTO.builder()
                        .id(cert.getId())
                        .studentId(cert.getStudent().getId())
                        .studentName(cert.getStudent().getName())
                        .courseId(cert.getCourse().getId())
                        .courseTitle(cert.getCourse().getTitle())
                        .certificateNumber(cert.getCertificateNumber())
                        .issuedAt(cert.getIssuedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

}
