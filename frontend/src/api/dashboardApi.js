import axiosInstance from './axiosConfig';
import { withFallback, getDummyDashboard, getCurrentRole } from './dummyData';

export const getDashboard = async () =>
  withFallback(
    async () => (await axiosInstance.get('/dashboard')).data,
    () => getDummyDashboard(getCurrentRole())
  );

export const getAdminStats = async () =>
  withFallback(
    async () => (await axiosInstance.get('/admin/stats')).data,
    () => getDummyDashboard('ADMIN')
  );

export const getInstructorStats = async () =>
  withFallback(
    async () => (await axiosInstance.get('/instructor/stats')).data,
    () => getDummyDashboard('INSTRUCTOR')
  );
