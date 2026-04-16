import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_COURSES } from './dummyData';

export const createOrder = async (courseId) =>
  withFallback(
    async () => (await axiosInstance.post('/payment/create-order', { courseId })).data,
    () => {
      const course = DUMMY_COURSES.find((c) => c.id === courseId) || DUMMY_COURSES[0];
      return {
        orderId: `order_demo_${Date.now()}`,
        amount: (course.price || 0) * 100,
        currency: 'INR',
        courseId,
      };
    }
  );

export const verifyPayment = async (paymentData) =>
  withFallback(
    async () => (await axiosInstance.post('/payment/verify', paymentData)).data,
    () => ({ success: true, enrollmentId: `e${Date.now()}` })
  );

export const getPaymentStatus = async (orderId) =>
  withFallback(
    async () => (await axiosInstance.get(`/payment/order/${orderId}`)).data,
    () => ({ status: 'COMPLETED', amount: 1499, orderId })
  );
