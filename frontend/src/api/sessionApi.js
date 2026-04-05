import axiosInstance from './axiosConfig';

export const getSessions = async () => {
  const response = await axiosInstance.get('/sessions');
  return response.data;
};

export const getCourseSessions = async (courseId) => {
  const response = await axiosInstance.get(`/sessions/course/${courseId}`);
  return response.data;
};

export const createSession = async (data) => {
  const response = await axiosInstance.post('/sessions', data);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await axiosInstance.put(`/sessions/${id}`, data);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await axiosInstance.delete(`/sessions/${id}`);
  return response.data;
};

export const getSession = async (id) => {
  const response = await axiosInstance.get(`/sessions/${id}`);
  return response.data;
};
