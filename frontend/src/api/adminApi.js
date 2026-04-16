import axiosInstance from './axiosConfig';
import { withFallback, DUMMY_USERS, DUMMY_COURSES, DUMMY_PAYMENTS, DUMMY_ENROLLMENTS } from './dummyData';

const paginate = (items, page = 1, pageSize = 10, key = 'items') => {
  const start = (page - 1) * pageSize;
  return {
    [key]: items.slice(start, start + pageSize),
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    page,
    total: items.length,
  };
};

export const getAllUsers = async (page = 1, search = '', role = '') =>
  withFallback(
    async () => (await axiosInstance.get('/admin/users', { params: { page, search, role } })).data,
    () => {
      let filtered = [...DUMMY_USERS];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
      }
      if (role) filtered = filtered.filter((u) => u.role === role);
      return paginate(filtered, page, 10, 'users');
    }
  );

export const updateUserRole = async (userId, role) =>
  withFallback(
    async () => (await axiosInstance.put(`/admin/users/${userId}/role`, { role })).data,
    () => ({ id: userId, role })
  );

export const deleteUser = async (userId) =>
  withFallback(
    async () => (await axiosInstance.delete(`/admin/users/${userId}`)).data,
    () => ({ success: true, id: userId })
  );

export const getAllCourses = async (page = 1, search = '') =>
  withFallback(
    async () => (await axiosInstance.get('/admin/courses', { params: { page, search } })).data,
    () => {
      let filtered = [...DUMMY_COURSES];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c) => c.title.toLowerCase().includes(q));
      }
      const withRevenue = filtered.map((c) => ({
        ...c,
        revenue: c.price * Math.round(c.enrollmentCount * 0.42),
      }));
      return paginate(withRevenue, page, 10, 'courses');
    }
  );

export const getPayments = async (page = 1, status = '') =>
  withFallback(
    async () => (await axiosInstance.get('/admin/payments', { params: { page, status } })).data,
    () => {
      let filtered = [...DUMMY_PAYMENTS];
      if (status) filtered = filtered.filter((p) => p.status === status);
      return paginate(filtered, page, 10, 'payments');
    }
  );

export const getEnrollments = async (page = 1) =>
  withFallback(
    async () => (await axiosInstance.get('/admin/enrollments', { params: { page } })).data,
    () => paginate(DUMMY_ENROLLMENTS, page, 10, 'enrollments')
  );
