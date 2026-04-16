import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_COURSES, DUMMY_LESSONS } from './dummyData';

const paginate = (items, page = 1, pageSize = 9) => {
  const start = (page - 1) * pageSize;
  return {
    courses: items.slice(start, start + pageSize),
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    page,
    total: items.length,
  };
};

export const getCourses = async (page = 1, search = '', category = '') =>
  withFallback(
    async () => (await axiosInstance.get('/courses', { params: { page, search, category } })).data,
    () => {
      let filtered = DUMMY_COURSES.filter((c) => c.isPublished);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
      }
      if (category) filtered = filtered.filter((c) => c.category === category);
      return paginate(filtered, page);
    }
  );

export const getCourse = async (id) =>
  withFallback(
    async () => (await axiosInstance.get(`/courses/${id}`)).data,
    () => DUMMY_COURSES.find((c) => c.id === id) || DUMMY_COURSES[0]
  );

export const createCourse = async (data) =>
  withFallback(
    async () => (await axiosInstance.post('/courses', data)).data,
    () => ({ id: `c${Date.now()}`, ...data, isPublished: false, enrollmentCount: 0, rating: 0 })
  );

export const updateCourse = async (id, data) =>
  withFallback(
    async () => (await axiosInstance.put(`/courses/${id}`, data)).data,
    () => ({ id, ...data })
  );

export const getLessons = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.get(`/courses/${courseId}/lessons`)).data,
    () => DUMMY_LESSONS[courseId] || DUMMY_LESSONS.c1
  );

export const addLesson = async (courseId, data) =>
  withFallback(
    async () => (await axiosInstance.post(`/courses/${courseId}/lessons`, data)).data,
    () => ({ id: `l${Date.now()}`, ...data })
  );

export const deleteCourse = async (id) =>
  withFallback(
    async () => (await axiosInstance.delete(`/courses/${id}`)).data,
    () => ({ success: true, id })
  );

export const publishCourse = async (id) =>
  withFallback(
    async () => (await axiosInstance.put(`/courses/${id}/publish`)).data,
    () => ({ id, isPublished: true })
  );
