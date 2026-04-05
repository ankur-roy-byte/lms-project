package com.lms.session;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveSessionDTO {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private Long instructorId;
    private String instructorName;
    private String title;
    private String description;
    private String meetingLink;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private Boolean active;

}
