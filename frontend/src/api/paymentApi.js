import axiosInstance from './axiosConfig';

export const createOrder = async (courseId) => {
  const response = await axiosInstance.post('/payment/create-order', { courseId });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axiosInstance.post('/payment/verify', paymentData);
  return response.data;
};

export const getPaymentStatus = async (orderId) => {
  const response = await axiosInstance.get(`/payment/order/${orderId}`);
  return response.data;
};
