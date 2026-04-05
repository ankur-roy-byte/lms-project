import axiosInstance from './axiosConfig';

export const getAllUsers = async (page = 1, search = '', role = '') => {
  const response = await axiosInstance.get('/admin/users', {
    params: { page, search, role },
  });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAllCourses = async (page = 1, search = '') => {
  const response = await axiosInstance.get('/admin/courses', {
    params: { page, search },
  });
  return response.data;
};

export const getPayments = async (page = 1, status = '') => {
  const response = await axiosInstance.get('/admin/payments', {
    params: { page, status },
  });
  return response.data;
};

export const getEnrollments = async (page = 1) => {
  const response = await axiosInstance.get('/admin/enrollments', {
    params: { page },
  });
  return response.data;
};
