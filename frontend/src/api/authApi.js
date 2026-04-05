import axiosInstance from './axiosConfig';

export const googleLogin = async (credential) => {
  const response = await axiosInstance.post('/auth/google', { token: credential });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
