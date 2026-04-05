package com.lms.quiz;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }

    public Quiz getQuizForLesson(Long lessonId) {
        return quizRepository.findByLessonId(lessonId).orElse(null);
    }

    public Quiz getFinalQuizForCourse(Long courseId) {
        return quizRepository.findByCourseIdAndIsFinalTrue(courseId).orElse(null);
    }

    public List<Question> getQuizQuestions(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    public QuizAttempt submitQuizAnswers(Long quizId, Long studentId, Map<Long, Character> answers) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) {
            return null;
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);
        int totalPoints = questions.stream().mapToInt(Question::getPoints).sum();
        int score = 0;

        for (Question question : questions) {
            Character selectedOption = answers.get(question.getId());
            if (selectedOption != null && selectedOption.equals(question.getCorrectOption())) {
                score += question.getPoints();
            }
        }

        int percentage = (int) ((double) score / totalPoints * 100);
        boolean passed = percentage >= quiz.getPassingScore();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(null)
                .score(percentage)
                .passed(passed)
                .build();

        QuizAttempt saved = quizAttemptRepository.save(attempt);
        log.info("Quiz {} submitted by student {}. Score: {}%", quizId, studentId, percentage);
        return saved;
    }

    public int calculateScore(Long quizId, Map<Long, Character> answers) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        int totalPoints = questions.stream().mapToInt(Question::getPoints).sum();
        int score = 0;

        for (Question question : questions) {
            Character selectedOption = answers.get(question.getId());
            if (selectedOption != null && selectedOption.equals(question.getCorrectOption())) {
                score += question.getPoints();
            }
        }

        return (int) ((double) score / totalPoints * 100);
    }

    public List<QuizAttempt> getStudentAttempts(Long studentId) {
        return quizAttemptRepository.findByStudentId(studentId);
    }

    public QuizAttempt getLatestAttempt(Long studentId, Long quizId) {
        return quizAttemptRepository.findTopByStudentIdAndQuizIdOrderByAttemptedAtDesc(studentId, quizId).orElse(null);
    }

}
