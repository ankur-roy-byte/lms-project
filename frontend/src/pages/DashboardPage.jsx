import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dashboardApi from '../api/dashboardApi';
import * as enrollmentApi from '../api/enrollmentApi';
import * as certificateApi from '../api/certificateApi';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import StatsCard from '../components/StatsCard';
import LiveSessionCard from '../components/LiveSessionCard';
import { useToast } from '../components/Toast';
import {
  BRAND,
  DASHBOARD_STATS,
  CURRENT_LESSON,
  RECENT_ACTIVITY,
} from '../data/constants';
import {
  BarChart3,
  BookOpen,
  Award,
  Users,
  Zap,
  ArrowRight,
  Play,
  Flame,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashboard, enrollmentsData, certificatesData] = await Promise.all([
          dashboardApi.getDashboard(),
          user?.role === 'STUDENT' ? enrollmentApi.getMyEnrollments() : Promise.resolve(null),
          user?.role === 'STUDENT' ? certificateApi.getMyCertificates() : Promise.resolve(null),
        ]);
        setDashboardData(dashboard);
        if (enrollmentsData) setEnrollments(enrollmentsData);
        if (certificatesData) setCertificates(certificatesData);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        // Use fallback data in dev
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const displayName = user?.name?.split(' ')[0] || 'Student';

  // Fallback stats from constants
  const stats = {
    modulesCompleted: dashboardData?.modulesCompleted ?? DASHBOARD_STATS.modulesCompleted,
    totalModules: dashboardData?.totalModules ?? DASHBOARD_STATS.totalModules,
    lessonsCompleted: dashboardData?.lessonsCompleted ?? DASHBOARD_STATS.lessonsCompleted,
    quizzesPassed: dashboardData?.quizzesPassed ?? DASHBOARD_STATS.quizzesPassed,
    daysStreak: dashboardData?.streak ?? DASHBOARD_STATS.daysStreak,
    overallProgress: dashboardData?.overallProgress ?? DASHBOARD_STATS.overallProgress,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Greeting */}
        <div className="mb-5">
          <h2 className="font-syne text-xl font-extrabold text-white">Good morning, {displayName}! 👋</h2>
          <p className="text-sm text-text-muted mt-1">You have 1 lesson remaining this week. Keep going!</p>
        </div>

        {/* Student Dashboard */}
        {(!user?.role || user?.role === 'STUDENT') && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="card">
                <div className="font-syne text-2xl font-extrabold text-white">
                  <span className="text-accent">{stats.modulesCompleted}</span>/{stats.totalModules}
                </div>
                <div className="text-[11px] text-text-muted mt-1">Modules Done</div>
                <div className="progress-bar-track mt-2">
                  <div className="progress-bar-fill" style={{ width: `${(stats.modulesCompleted / stats.totalModules) * 100}%` }}></div>
                </div>
              </div>
              <div className="card">
                <div className="font-syne text-2xl font-extrabold text-white">
                  <span className="text-accent">{stats.lessonsCompleted}</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">Lessons Completed</div>
              </div>
              <div className="card">
                <div className="font-syne text-2xl font-extrabold text-white">
                  <span className="text-accent">{stats.quizzesPassed}</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">Quizzes Passed</div>
              </div>
              <div className="card">
                <div className="font-syne text-2xl font-extrabold text-white">
                  <span className="text-accent">{stats.daysStreak}</span>
                </div>
                <div className="text-[11px] text-text-muted mt-1">Days Streak 🔥</div>
              </div>
            </div>

            {/* Continue Where You Left Off */}
            <div className="font-syne text-sm font-bold text-white mb-3">Continue Where You Left Off</div>
            <div
              className="bg-accent/[0.08] border border-accent/20 rounded-[14px] p-[18px] flex items-center gap-4 mb-5 cursor-pointer hover:bg-accent/[0.12] transition"
              onClick={() => navigate('/courses/1')}
            >
              <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-[#1a2540] to-[#243050] flex items-center justify-center text-xl flex-shrink-0">
                💻
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white">Module {CURRENT_LESSON.moduleNumber} — {CURRENT_LESSON.moduleTitle}</p>
                <span className="text-[11px] text-text-muted">Lesson {CURRENT_LESSON.lessonNumber}: {CURRENT_LESSON.lessonTitle}</span>
                <div className="progress-bar-track mt-[6px]">
                  <div className="progress-bar-fill" style={{ width: `${stats.overallProgress}%` }}></div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Play className="w-3 h-3 text-brand-bg fill-brand-bg" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="font-syne text-sm font-bold text-white mb-3">Recent Activity</div>
            <div className="flex flex-col gap-2 mb-5">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 bg-white/[0.03] rounded-[10px] p-3">
                  <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    activity.iconType === 'done' ? 'bg-success/[0.12]' : 'bg-accent/[0.12]'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-primary font-medium truncate">{activity.title}</p>
                    <span className="text-[11px] text-text-muted">{activity.subtitle}</span>
                  </div>
                  <span className={`text-[10px] px-[9px] py-[3px] rounded-[10px] font-semibold font-syne ${
                    activity.badgeType === 'done'
                      ? 'bg-success/[0.12] text-success'
                      : 'bg-accent/[0.12] text-accent'
                  }`}>
                    {activity.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* Enrolled Courses */}
            {enrollments.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-syne text-sm font-bold text-white">My Courses</div>
                  <Link to="/courses" className="flex items-center gap-1 text-accent hover:text-accent-hover text-xs font-medium">
                    Explore More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrollments.map((enrollment) => (
                    <CourseCard
                      key={enrollment.courseId}
                      course={enrollment.course}
                      isEnrolled={true}
                      progress={enrollment.progressPercentage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            {dashboardData?.upcomingSessions && dashboardData.upcomingSessions.length > 0 && (
              <div className="mb-5">
                <div className="font-syne text-sm font-bold text-white mb-3">Upcoming Sessions</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.upcomingSessions.map((session) => (
                    <LiveSessionCard
                      key={session.id}
                      session={session}
                      onJoin={(session) => {
                        if (session.meetingLink) window.open(session.meetingLink, '_blank');
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Instructor Dashboard */}
        {user?.role === 'INSTRUCTOR' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <StatsCard icon={BookOpen} label="My Courses" value={dashboardData?.courseCount || 0} color="primary" />
              <StatsCard icon={Users} label="Total Students" value={dashboardData?.studentCount || 0} color="blue" />
              <StatsCard icon={BarChart3} label="Revenue" value={`₹${dashboardData?.revenue || 0}`} color="green" />
            </div>
            <div className="card mb-5">
              <div className="font-syne text-sm font-bold text-white mb-3">Quick Actions</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/create-course" className="btn-primary text-sm">Create New Course</Link>
                <Link to="/live-sessions" className="btn-outline text-sm">Schedule Session</Link>
              </div>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {user?.role === 'ADMIN' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatsCard icon={Users} label="Total Users" value={dashboardData?.totalUsers || 0} color="blue" />
              <StatsCard icon={BookOpen} label="Total Courses" value={dashboardData?.totalCourses || 0} color="purple" />
              <StatsCard icon={Award} label="Enrollments" value={dashboardData?.totalEnrollments || 0} color="green" />
              <StatsCard icon={BarChart3} label="Revenue" value={`₹${dashboardData?.totalRevenue || 0}`} color="orange" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              <Link to="/admin?tab=users" className="card hover:bg-white/[0.06] transition">
                <Users className="w-6 h-6 text-blue-400 mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">Manage Users</h3>
                <p className="text-xs text-text-muted">View and manage all users</p>
              </Link>
              <Link to="/admin?tab=courses" className="card hover:bg-white/[0.06] transition">
                <BookOpen className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">Manage Courses</h3>
                <p className="text-xs text-text-muted">Review and manage courses</p>
              </Link>
              <Link to="/admin?tab=payments" className="card hover:bg-white/[0.06] transition">
                <BarChart3 className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">View Payments</h3>
                <p className="text-xs text-text-muted">Review transaction history</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
