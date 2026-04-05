package com.lms.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDTO {

    private Long id;
    private Long courseId;
    private Long lessonId;
    private String title;
    private Boolean isFinal;
    private Integer passingScore;
    private List<QuestionDTO> questions;
    private LocalDateTime createdAt;

}
