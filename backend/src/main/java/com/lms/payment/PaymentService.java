package com.lms.payment;

import com.lms.course.Course;
import com.lms.course.CourseRepository;
import com.lms.enrollment.EnrollmentService;
import com.lms.user.User;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentService enrollmentService;
    private final RazorpayClient razorpayClient;

    public Payment createOrder(User student, Long courseId, BigDecimal amount) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return null;
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount.multiply(new BigDecimal(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

            com.razorpay.Order order = razorpayClient.orders.create(orderRequest);

            Payment payment = Payment.builder()
                    .student(student)
                    .course(course)
                    .razorpayOrderId(order.get("id"))
                    .amount(amount)
                    .status(PaymentStatus.CREATED)
                    .build();

            Payment saved = paymentRepository.save(payment);
            log.info("Razorpay order created: {} for student {}", order.get("id"), student.getId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating Razorpay order: {}", e.getMessage());
            return null;
        }
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature, String keySecret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
            String generatedSignature = toHex(hmac.doFinal(payload.getBytes()));

            if (!generatedSignature.equals(signature)) {
                log.warn("Signature verification failed for order {}", orderId);
                return false;
            }

            Payment payment = paymentRepository.findByRazorpayOrderId(orderId).orElse(null);
            if (payment == null) {
                log.warn("Payment not found for order {}", orderId);
                return false;
            }

            payment.setRazorpayPaymentId(paymentId);
            payment.setRazorpaySignature(signature);
            payment.setStatus(PaymentStatus.PAID);
            paymentRepository.save(payment);

            enrollmentService.enrollStudent(payment.getStudent(), payment.getCourse().getId());

            log.info("Payment verified and enrollment created for order {}", orderId);
            return true;
        } catch (Exception e) {
            log.error("Error verifying payment: {}", e.getMessage());
            return false;
        }
    }

    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByRazorpayOrderId(orderId).orElse(null);
    }

    public List<Payment> getStudentPayments(Long studentId) {
        return paymentRepository.findByStudentId(studentId);
    }

    public long getTotalPaymentCount() {
        return paymentRepository.count();
    }

    public BigDecimal getTotalRevenue() {
        return paymentRepository.findByStatus(PaymentStatus.PAID).stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String toHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

}
