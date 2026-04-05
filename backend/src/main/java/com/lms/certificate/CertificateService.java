package com.lms.certificate;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
import com.lms.course.Lesson;
import com.lms.course.LessonRepository;
import com.lms.enrollment.Enrollment;
import com.lms.enrollment.EnrollmentRepository;
import com.lms.enrollment.LessonProgressRepository;
import com.lms.quiz.Quiz;
import com.lms.quiz.QuizAttempt;
import com.lms.quiz.QuizAttemptRepository;
import com.lms.quiz.QuizRepository;
import com.lms.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;

    public boolean isEligibleForCertificate(Long studentId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).orElse(null);
        if (enrollment == null) {
            return false;
        }

        List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
        if (lessons.isEmpty()) {
            return false;
        }

        int completedLessons = lessonProgressRepository.countByEnrollmentIdAndCompletedAtNotNull(enrollment.getId());

        if (completedLessons < lessons.size()) {
            return false;
        }

        Quiz finalQuiz = quizRepository.findByCourseIdAndIsFinalTrue(courseId).orElse(null);
        if (finalQuiz != null) {
            QuizAttempt attempt = quizAttemptRepository
                    .findTopByStudentIdAndQuizIdOrderByAttemptedAtDesc(studentId, finalQuiz.getId())
                    .orElse(null);

            return attempt != null && attempt.getPassed();
        }

        return true;
    }

    public Certificate generateCertificate(Long studentId, Long courseId) {
        if (!isEligibleForCertificate(studentId, courseId)) {
            return null;
        }

        Certificate existing = certificateRepository.findByStudentIdAndCourseId(studentId, courseId).orElse(null);
        if (existing != null) {
            return existing;
        }

        User student = null;
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return null;
        }

        Certificate certificate = Certificate.builder()
                .student(student)
                .course(course)
                .build();

        Certificate saved = certificateRepository.save(certificate);
        log.info("Certificate {} generated for student {} in course {}", saved.getId(), studentId, courseId);
        return saved;
    }

    public File generateCertificatePDF(Long certificateId, User student, Course course) throws IOException {
        Certificate certificate = certificateRepository.findById(certificateId).orElse(null);
        if (certificate == null) {
            throw new IllegalArgumentException("Certificate not found");
        }

        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD), 48);
        contentStream.beginText();
        contentStream.newLineAtOffset(150, 700);
        contentStream.showText("CERTIFICATE OF COMPLETION");
        contentStream.endText();

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN), 18);
        contentStream.beginText();
        contentStream.newLineAtOffset(200, 600);
        contentStream.showText("This is to certify that");
        contentStream.endText();

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD), 24);
        contentStream.beginText();
        contentStream.newLineAtOffset(150, 550);
        contentStream.showText(student.getName());
        contentStream.endText();

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN), 18);
        contentStream.beginText();
        contentStream.newLineAtOffset(150, 500);
        contentStream.showText("has successfully completed the course");
        contentStream.endText();

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD), 24);
        contentStream.beginText();
        contentStream.newLineAtOffset(100, 450);
        contentStream.showText(course.getTitle());
        contentStream.endText();

        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN), 14);
        contentStream.beginText();
        contentStream.newLineAtOffset(200, 350);
        contentStream.showText("Certificate Number: " + certificate.getCertificateNumber());
        contentStream.endText();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        String issuedDate = certificate.getIssuedAt().format(formatter);

        contentStream.beginText();
        contentStream.newLineAtOffset(250, 300);
        contentStream.showText("Issued: " + issuedDate);
        contentStream.endText();

        contentStream.close();

        String fileName = "certificate_" + certificateId + ".pdf";
        File file = new File(System.getProperty("java.io.tmpdir") + File.separator + fileName);
        document.save(file);
        document.close();

        log.info("Certificate PDF generated: {}", file.getAbsolutePath());
        return file;
    }

    public List<Certificate> getStudentCertificates(Long studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    public Certificate getCertificateByNumber(String certificateNumber) {
        return certificateRepository.findByCertificateNumber(certificateNumber).orElse(null);
    }

}
