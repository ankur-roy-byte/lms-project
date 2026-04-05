import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import * as sessionApi from '../api/sessionApi';
import LiveSessionCard from '../components/LiveSessionCard';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const LiveSessionPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseName: '',
    meetingLink: '',
    scheduledAt: '',
    duration: 60,
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionApi.getSessions();
      setSessions(response || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.courseName || !formData.meetingLink || !formData.scheduledAt) {
      error('Please fill all required fields');
      return;
    }

    try {
      await sessionApi.createSession(formData);
      success('Session scheduled successfully!');
      setFormData({
        title: '',
        courseName: '',
        meetingLink: '',
        scheduledAt: '',
        duration: 60,
      });
      setShowForm(false);
      fetchSessions();
    } catch (err) {
      console.error('Failed to create session:', err);
      error('Failed to schedule session');
    }
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      error('Meeting link not available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
            <p className="text-gray-600 mt-2">Join interactive learning sessions with instructors</p>
          </div>
          {user?.role === 'INSTRUCTOR' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 btn-primary"
            >
              <Plus className="w-5 h-5" />
              Schedule Session
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* New Session Form */}
        {showForm && user?.role === 'INSTRUCTOR' && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Session</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., React Hooks Deep Dive"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g., Advanced React"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link *
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Schedule Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="spinner"></div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <LiveSessionCard
                key={session.id}
                session={session}
                onJoin={handleJoinSession}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No sessions available</p>
            <p className="text-gray-500">
              {user?.role === 'INSTRUCTOR'
                ? 'Schedule your first session to get started'
                : 'Check back soon for upcoming live sessions'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSessionPage;
