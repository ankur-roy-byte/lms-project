import axiosInstance from './axiosConfig';

export const getCourses = async (page = 1, search = '', category = '') => {
  const response = await axiosInstance.get('/courses', {
    params: { page, search, category },
  });
  return response.data;
};

export const getCourse = async (id) => {
  const response = await axiosInstance.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data) => {
  const response = await axiosInstance.post('/courses', data);
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await axiosInstance.put(`/courses/${id}`, data);
  return response.data;
};

export const getLessons = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}/lessons`);
  return response.data;
};

export const addLesson = async (courseId, data) => {
  const response = await axiosInstance.post(`/courses/${courseId}/lessons`, data);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/courses/${id}`);
  return response.data;
};

export const publishCourse = async (id) => {
  const response = await axiosInstance.put(`/courses/${id}/publish`);
  return response.data;
};
