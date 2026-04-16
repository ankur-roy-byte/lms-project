import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_QUIZZES } from './dummyData';

const firstQuiz = () => Object.values(DUMMY_QUIZZES)[0];

export const getLessonQuiz = async (lessonId) =>
  withFallback(
    async () => (await axiosInstance.get(`/quiz/lesson/${lessonId}`)).data,
    () => DUMMY_QUIZZES[`q${String(lessonId).replace(/\D/g, '')}`] || firstQuiz()
  );

export const getFinalQuiz = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.get(`/quiz/final/${courseId}`)).data,
    () => firstQuiz()
  );

export const submitQuiz = async (quizId, answers) =>
  withFallback(
    async () => (await axiosInstance.post('/quiz/submit', { quizId, answers })).data,
    () => {
      const quiz = DUMMY_QUIZZES[quizId] || firstQuiz();
      const total = quiz.questions.length;
      let correct = 0;
      quiz.questions.forEach((q) => {
        if ((answers || {})[q.id] === q.correctAnswer) correct += 1;
      });
      const score = Math.round((correct / total) * 100);
      return {
        score,
        correctAnswers: correct,
        totalQuestions: total,
        isPassed: score >= (quiz.passingScore || 60),
        quizId,
      };
    }
  );

export const getMyAttempts = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.get(`/quiz/attempts/${courseId}`)).data,
    () => [
      { quizId: 'q1', score: 80, attemptDate: new Date(Date.now() - 5 * 86400000).toISOString(), isPassed: true },
      { quizId: 'q2', score: 60, attemptDate: new Date(Date.now() - 3 * 86400000).toISOString(), isPassed: true },
      { quizId: 'q3', score: 100, attemptDate: new Date(Date.now() - 1 * 86400000).toISOString(), isPassed: true },
    ]
  );

export const getQuizDetails = async (quizId) =>
  withFallback(
    async () => (await axiosInstance.get(`/quiz/${quizId}`)).data,
    () => DUMMY_QUIZZES[quizId] || firstQuiz()
  );
