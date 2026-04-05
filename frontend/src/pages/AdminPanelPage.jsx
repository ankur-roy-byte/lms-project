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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage users, courses, and payments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users
              </div>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
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
                  className="input-field"
                />
              </div>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="input-field md:w-48"
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          {editingUserId === user.id ? (
                            <div className="flex gap-2">
                              <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="input-field text-sm py-1"
                              >
                                <option value="STUDENT">Student</option>
                                <option value="INSTRUCTOR">Instructor</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <button
                                onClick={() => handleUpdateUserRole(user.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'ADMIN'
                                  ? 'bg-red-100 text-red-800'
                                  : user.role === 'INSTRUCTOR'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setSelectedRole(user.role);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
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
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Courses Table */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Enrollments</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.instructorName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.enrollmentCount}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{course.revenue}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              course.isPublished
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-red-600 hover:text-red-800 font-medium">
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
              className="input-field w-full md:w-48"
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{payment.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{payment.userName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.courseName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ₹{payment.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
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
