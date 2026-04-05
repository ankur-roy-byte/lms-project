package com.lms.payment;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
import com.lms.user.User;
import com.lms.user.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        Long courseId = null;
        BigDecimal amount = null;

        try {
            courseId = ((Number) request.get("courseId")).longValue();
            amount = new BigDecimal(request.get("amount").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid courseId or amount")
            );
        }

        User student = userRepository.findById(Long.parseLong(userId)).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (student == null || course == null) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "User or course not found")
            );
        }

        Payment payment = paymentService.createOrder(student, courseId, amount);
        if (payment == null) {
            return ResponseEntity.status(400).body(
                    Map.of("error", "Failed to create payment order")
            );
        }

        PaymentDTO paymentDTO = PaymentDTO.builder()
                .id(payment.getId())
                .studentId(payment.getStudent().getId())
                .courseId(payment.getCourse().getId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus().toString())
                .createdAt(payment.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "payment", paymentDTO,
                "orderId", payment.getRazorpayOrderId()
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        String orderId = request.get("razorpayOrderId");
        String paymentId = request.get("razorpayPaymentId");
        String signature = request.get("razorpaySignature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Missing payment verification details")
            );
        }

        boolean verified = paymentService.verifyPayment(orderId, paymentId, signature, razorpayKeySecret);
        if (!verified) {
            return ResponseEntity.status(400).body(
                    Map.of("error", "Payment verification failed")
            );
        }

        Payment payment = paymentService.getPaymentByOrderId(orderId);
        PaymentDTO paymentDTO = PaymentDTO.builder()
                .id(payment.getId())
                .studentId(payment.getStudent().getId())
                .courseId(payment.getCourse().getId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .status(payment.getStatus().toString())
                .createdAt(payment.getCreatedAt())
                .build();

        return ResponseEntity.ok(Map.of(
                "message", "Payment verified successfully",
                "payment", paymentDTO
        ));
    }

}
