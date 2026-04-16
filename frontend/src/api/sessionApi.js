import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_SESSIONS } from './dummyData';

export const getSessions = async () =>
  withFallback(
    async () => (await axiosInstance.get('/sessions')).data,
    () => DUMMY_SESSIONS
  );

export const getCourseSessions = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.get(`/sessions/course/${courseId}`)).data,
    () => DUMMY_SESSIONS.slice(0, 2)
  );

export const createSession = async (data) =>
  withFallback(
    async () => (await axiosInstance.post('/sessions', data)).data,
    () => ({ id: `s${Date.now()}`, ...data })
  );

export const updateSession = async (id, data) =>
  withFallback(
    async () => (await axiosInstance.put(`/sessions/${id}`, data)).data,
    () => ({ id, ...data })
  );

export const deleteSession = async (id) =>
  withFallback(
    async () => (await axiosInstance.delete(`/sessions/${id}`)).data,
    () => ({ success: true, id })
  );

export const getSession = async (id) =>
  withFallback(
    async () => (await axiosInstance.get(`/sessions/${id}`)).data,
    () => DUMMY_SESSIONS.find((s) => s.id === id) || DUMMY_SESSIONS[0]
  );
