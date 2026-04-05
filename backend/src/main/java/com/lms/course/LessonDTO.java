package com.lms.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDTO {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String youtubeUrl;
    private Integer orderIndex;
    private Integer durationMinutes;

}
