import axiosInstance from './axiosConfig';

export const getDashboard = async () => {
  const response = await axiosInstance.get('/dashboard');
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

export const getInstructorStats = async () => {
  const response = await axiosInstance.get('/instructor/stats');
  return response.data;
};
