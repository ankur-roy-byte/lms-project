package com.lms.quiz;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<?> getQuizForLesson(@PathVariable Long lessonId) {
        Quiz quiz = quizService.getQuizForLesson(lessonId);
        if (quiz == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Quiz not found for this lesson"));
        }

        List<Question> questions = quizService.getQuizQuestions(quiz.getId());
        QuizDTO quizDTO = convertToDTO(quiz, questions);
        return ResponseEntity.ok(quizDTO);
    }

    @GetMapping("/final/{courseId}")
    public ResponseEntity<?> getFinalQuizForCourse(@PathVariable Long courseId) {
        Quiz quiz = quizService.getFinalQuizForCourse(courseId);
        if (quiz == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Final quiz not found for this course"));
        }

        List<Question> questions = quizService.getQuizQuestions(quiz.getId());
        QuizDTO quizDTO = convertToDTO(quiz, questions);
        return ResponseEntity.ok(quizDTO);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        Object quizIdObj = request.get("quizId");
        Object answersObj = request.get("answers");

        if (quizIdObj == null || answersObj == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Missing quizId or answers")
            );
        }

        Long quizId = Long.parseLong(quizIdObj.toString());

        Map<Long, Character> answers = new java.util.HashMap<>();
        if (answersObj instanceof List) {
            List<?> answersList = (List<?>) answersObj;
            for (Object answerObj : answersList) {
                if (answerObj instanceof Map) {
                    Map<?, ?> answerMap = (Map<?, ?>) answerObj;
                    Object qId = answerMap.get("questionId");
                    Object sel = answerMap.get("selectedOption");
                    if (qId != null && sel != null) {
                        answers.put(
                                Long.parseLong(qId.toString()),
                                sel.toString().charAt(0)
                        );
                    }
                }
            }
        }

        int score = quizService.calculateScore(quizId, answers);
        Quiz quiz = quizService.getQuizById(quizId);

        if (quiz == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Quiz not found"));
        }

        boolean passed = score >= quiz.getPassingScore();

        return ResponseEntity.ok(Map.of(
                "score", score,
                "maxScore", 100,
                "passed", passed,
                "passingScore", quiz.getPassingScore()
        ));
    }

    @GetMapping("/attempts/{courseId}")
    public ResponseEntity<?> getMyAttempts(@PathVariable Long courseId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Object detailsObj = auth.getDetails();
        if (!(detailsObj instanceof Claims)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Claims claims = (Claims) detailsObj;
        String userId = (String) claims.get("userId");

        List<QuizAttempt> attempts = quizService.getStudentAttempts(Long.parseLong(userId));
        List<QuizAttemptDTO> dtoList = attempts.stream()
                .filter(a -> a.getQuiz().getCourse().getId().equals(courseId))
                .map(this::convertAttemptToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    private QuizDTO convertToDTO(Quiz quiz, List<Question> questions) {
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(q -> QuestionDTO.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .points(q.getPoints())
                        .correctOption(q.getCorrectOption())
                        .build())
                .collect(Collectors.toList());

        return QuizDTO.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse().getId())
                .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
                .title(quiz.getTitle())
                .isFinal(quiz.getIsFinal())
                .passingScore(quiz.getPassingScore())
                .questions(questionDTOs)
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    private QuizAttemptDTO convertAttemptToDTO(QuizAttempt attempt) {
        return QuizAttemptDTO.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .score(attempt.getScore())
                .maxScore(100)
                .passed(attempt.getPassed())
                .passingScore(attempt.getQuiz().getPassingScore())
                .attemptedAt(attempt.getAttemptedAt())
                .build();
    }

}
