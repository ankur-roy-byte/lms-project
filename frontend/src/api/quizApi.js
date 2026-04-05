import axiosInstance from './axiosConfig';

export const getLessonQuiz = async (lessonId) => {
  const response = await axiosInstance.get(`/quiz/lesson/${lessonId}`);
  return response.data;
};

export const getFinalQuiz = async (courseId) => {
  const response = await axiosInstance.get(`/quiz/final/${courseId}`);
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await axiosInstance.post('/quiz/submit', { quizId, answers });
  return response.data;
};

export const getMyAttempts = async (courseId) => {
  const response = await axiosInstance.get(`/quiz/attempts/${courseId}`);
  return response.data;
};

export const getQuizDetails = async (quizId) => {
  const response = await axiosInstance.get(`/quiz/${quizId}`);
  return response.data;
};
