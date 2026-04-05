package com.lms.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptDTO {

    private Long id;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer maxScore;
    private Boolean passed;
    private Integer passingScore;
    private LocalDateTime attemptedAt;

}
