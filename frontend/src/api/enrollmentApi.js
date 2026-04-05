import axiosInstance from './axiosConfig';

export const enroll = async (courseId) => {
  const response = await axiosInstance.post('/enroll', { courseId });
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await axiosInstance.get('/enrollments');
  return response.data;
};

export const markLessonComplete = async (enrollmentId, lessonId) => {
  const response = await axiosInstance.post('/progress', { enrollmentId, lessonId });
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const response = await axiosInstance.get(`/progress/${courseId}`);
  return response.data;
};

export const unenroll = async (courseId) => {
  const response = await axiosInstance.post('/unenroll', { courseId });
  return response.data;
};
