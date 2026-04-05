package com.lms.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDTO {

    private Long id;
    private Long studentId;
    private Long courseId;
    private String courseTitle;
    private String courseThumbnail;
    private LocalDateTime enrolledAt;
    private Boolean completed;
    private LocalDateTime completedAt;
    private Integer progressPercentage;

}
