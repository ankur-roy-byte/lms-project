import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_ENROLLMENTS, DUMMY_LESSONS } from './dummyData';

export const enroll = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.post('/enroll', { courseId })).data,
    () => ({ success: true, enrollmentId: `e${Date.now()}`, courseId })
  );

export const getMyEnrollments = async () =>
  withFallback(
    async () => (await axiosInstance.get('/enrollments')).data,
    () => DUMMY_ENROLLMENTS
  );

export const markLessonComplete = async (enrollmentId, lessonId) =>
  withFallback(
    async () => (await axiosInstance.post('/progress', { enrollmentId, lessonId })).data,
    () => ({ success: true, enrollmentId, lessonId })
  );

export const getCourseProgress = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.get(`/progress/${courseId}`)).data,
    () => {
      const enr = DUMMY_ENROLLMENTS.find((e) => e.courseId === courseId);
      const lessons = DUMMY_LESSONS[courseId] || [];
      return {
        progressPercentage: enr?.progressPercentage ?? 0,
        completedLessons: enr?.completedLessons ?? [],
        totalLessons: lessons.length,
      };
    }
  );

export const unenroll = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.post('/unenroll', { courseId })).data,
    () => ({ success: true, courseId })
  );
