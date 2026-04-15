import React, { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, Edit2, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import * as adminApi from '../api/adminApi';
import { useToast } from '../components/Toast';

const AdminPanelPage = () => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  // Users State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Courses State
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');

  // Payments State
  const [payments, setPayments] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('');

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers(1, userSearch, userRole);
      setUsers(response.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllCourses(1, courseSearch);
      setCourses(response.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPayments(1, paymentStatus);
      setPayments(response.payments || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab, userSearch, userRole, courseSearch, paymentStatus]);

  // Handle user role update
  const handleUpdateUserRole = async (userId) => {
    try {
      await adminApi.updateUserRole(userId, selectedRole);
      success('User role updated successfully');
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user role:', err);
      error('Failed to update user role');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
        error('Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <div className="bg-brand-surface border-b border-white/[0.08] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white font-syne">Admin Panel</h1>
          <p className="text-text-muted mt-2">Manage users, courses, and payments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-brand-surface border-b border-white/[0.08] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'courses'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payments'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payments
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-accent transition-colors md:w-48"
              >
                <option value="">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="bg-brand-surface border border-white/[0.08] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.03]">
                        <td className="px-6 py-4 text-sm font-medium text-white">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <div className="flex gap-2">
                              <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-brand-bg border border-white/[0.1] rounded-lg text-white text-sm py-1 px-2 focus:outline-none focus:border-accent"
                              >
                                <option value="STUDENT">Student</option>
                                <option value="INSTRUCTOR">Instructor</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <button
                                onClick={() => handleUpdateUserRole(user.id)}
                                className="px-2 py-1 bg-success text-brand-bg rounded text-sm font-medium hover:bg-success/80"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                                user.role === 'ADMIN'
                                  ? 'bg-red-500/[0.15] text-red-400'
                                  : user.role === 'INSTRUCTOR'
                                    ? 'bg-blue-500/[0.15] text-blue-400'
                                    : 'bg-success/[0.15] text-success'
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setSelectedRole(user.role);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-10 px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white placeholder-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Courses Table */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="bg-brand-surface border border-white/[0.08] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Instructor</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Enrollments</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-white/[0.03]">
                        <td className="px-6 py-4 text-sm font-medium text-white">{course.title}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{course.instructorName}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{course.enrollmentCount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white font-syne">{course.revenue}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                              course.isPublished
                                ? 'bg-success/[0.15] text-success'
                                : 'bg-white/[0.06] text-text-muted'
                            }`}
                          >
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Status Filter */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-4 py-3 bg-brand-bg border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-accent transition-colors w-full md:w-48"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>

            {/* Payments Table */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="bg-brand-surface border border-white/[0.08] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/[0.08]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-white/[0.03]">
                        <td className="px-6 py-4 text-sm font-mono text-text-muted">{payment.orderId}</td>
                        <td className="px-6 py-4 text-sm text-white">{payment.userName}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{payment.courseName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white font-syne">
                          {payment.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                              payment.status === 'COMPLETED'
                                ? 'bg-success/[0.15] text-success'
                                : payment.status === 'PENDING'
                                  ? 'bg-accent/[0.15] text-accent'
                                  : 'bg-red-500/[0.15] text-red-400'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
