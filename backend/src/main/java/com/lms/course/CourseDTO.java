package com.lms.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String thumbnailUrl;
    private String category;
    private Long instructorId;
    private String instructorName;
    private String instructorEmail;
    private Boolean published;
    private LocalDateTime createdAt;

}
