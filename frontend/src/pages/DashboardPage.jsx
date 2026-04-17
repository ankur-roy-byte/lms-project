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
  Clock,
  Star,
  Trophy,
  Target,
  TrendingUp,
} from 'lucide-react';

// ── Inline mini-components ──────────────────────────────────────

const StatPill = ({ icon: Icon, label, value, iconClass }) => (
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-2">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconClass}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="font-syne text-2xl font-extrabold text-white leading-none">{value}</div>
    <div className="text-[11px] text-text-muted">{label}</div>
  </div>
);

// ── Main component ──────────────────────────────────────────────

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
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* ── STUDENT DASHBOARD ───────────────────────────────── */}
        {(!user?.role || user?.role === 'STUDENT') && (
          <>
            {/* Gradient Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1060] via-[#1e1a6e] to-[#0f1a3e] border border-white/[0.08] p-6 md:p-8">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              {/* Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-accent/80 uppercase tracking-widest mb-1 font-syne">
                    {BRAND.shortName} · Dashboard
                  </p>
                  <h2 className="font-syne text-2xl md:text-3xl font-extrabold text-white leading-tight mb-1">
                    Good morning, {displayName}! 👋
                  </h2>
                  <p className="text-sm text-white/50">
                    You have 1 lesson remaining this week. Keep the momentum going!
                  </p>
                </div>

                {/* Streak badge */}
                <div className="flex-shrink-0 flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-2xl px-5 py-3">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <div>
                    <div className="font-syne text-2xl font-extrabold text-white leading-none">
                      {stats.daysStreak}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">day streak</div>
                  </div>
                </div>
              </div>

              {/* Overall progress strip */}
              <div className="relative mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-white/50">Overall Progress</span>
                  <span className="text-[12px] font-bold text-accent font-syne">{stats.overallProgress}%</span>
                </div>
                <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-amber-300 rounded-full transition-all duration-700"
                    style={{ width: `${stats.overallProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatPill
                icon={BookOpen}
                label="Modules Done"
                value={`${stats.modulesCompleted}/${stats.totalModules}`}
                iconClass="bg-blue-500/10 text-blue-400"
              />
              <StatPill
                icon={Zap}
                label="Lessons Completed"
                value={stats.lessonsCompleted}
                iconClass="bg-accent/10 text-accent"
              />
              <StatPill
                icon={Target}
                label="Quizzes Passed"
                value={stats.quizzesPassed}
                iconClass="bg-purple-500/10 text-purple-400"
              />
              <StatPill
                icon={Trophy}
                label="Certificates"
                value={certificates.length || 0}
                iconClass="bg-success/10 text-success"
              />
            </div>

            {/* Continue Learning Card */}
            <div>
              <h3 className="font-syne text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Continue Where You Left Off
              </h3>
              <div
                className="group bg-white/[0.04] border border-white/[0.08] hover:border-accent/30 hover:bg-white/[0.06] rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_32px_rgba(245,158,11,0.06)]"
                onClick={() => navigate('/courses/1')}
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-[#1a2540] to-[#243050] flex items-center justify-center text-2xl flex-shrink-0 border border-white/[0.06]">
                  🔬
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-muted mb-0.5">
                    Phase {CURRENT_LESSON.moduleNumber} · {CURRENT_LESSON.moduleTitle}
                  </p>
                  <p className="text-sm font-semibold text-white truncate mb-2">
                    Lesson {CURRENT_LESSON.lessonNumber}: {CURRENT_LESSON.lessonTitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-amber-300 rounded-full transition-all duration-500"
                        style={{ width: `${stats.overallProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-accent font-syne flex-shrink-0">
                      {stats.overallProgress}%
                    </span>
                  </div>
                </div>

                {/* Play button */}
                <div className="w-11 h-11 rounded-full bg-accent group-hover:bg-accent-hover flex items-center justify-center flex-shrink-0 transition-colors shadow-[0_0_16px_rgba(245,158,11,0.3)]">
                  <Play className="w-4 h-4 text-brand-bg fill-brand-bg ml-0.5" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-syne text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Recent Activity
              </h3>
              <div className="flex flex-col gap-2">
                {RECENT_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-semibold ${
                      activity.iconType === 'done'
                        ? 'bg-success/[0.12] text-success'
                        : 'bg-accent/[0.12] text-accent'
                    }`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white font-medium truncate">{activity.title}</p>
                      <p className="text-[11px] text-text-muted">{activity.subtitle}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-bold font-syne ${
                      activity.badgeType === 'done'
                        ? 'bg-success/[0.12] text-success border border-success/20'
                        : 'bg-accent/[0.12] text-accent border border-accent/20'
                    }`}>
                      {activity.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled Courses */}
            {enrollments.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-syne text-sm font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    My Courses
                  </h3>
                  <Link
                    to="/courses"
                    className="flex items-center gap-1 text-accent hover:text-accent-hover text-xs font-semibold font-syne transition-colors"
                  >
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
              <div>
                <h3 className="font-syne text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Upcoming Sessions
                </h3>
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

        {/* ── INSTRUCTOR DASHBOARD ────────────────────────────── */}
        {user?.role === 'INSTRUCTOR' && (
          <>
            {/* Welcome */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1a30] via-[#162040] to-[#0a1020] border border-white/[0.08] p-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <p className="text-[11px] font-semibold text-blue-400/80 uppercase tracking-widest mb-1 font-syne">Instructor Panel</p>
              <h2 className="font-syne text-2xl font-extrabold text-white mb-1">Welcome back, {displayName}!</h2>
              <p className="text-sm text-white/40">Manage your courses and track student progress.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard icon={BookOpen} label="My Courses" value={dashboardData?.courseCount || 0} color="primary" />
              <StatsCard icon={Users} label="Total Students" value={dashboardData?.studentCount || 0} color="blue" />
              <StatsCard icon={BarChart3} label="Revenue" value={`₹${dashboardData?.revenue || 0}`} color="green" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <h3 className="font-syne text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                Quick Actions
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/create-course"
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-brand-bg px-5 py-3 rounded-xl text-sm font-bold font-syne transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Create New Course
                </Link>
                <Link
                  to="/live-sessions"
                  className="flex-1 flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.09] text-white border border-white/[0.1] px-5 py-3 rounded-xl text-sm font-bold font-syne transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Schedule Session
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ── ADMIN DASHBOARD ─────────────────────────────────── */}
        {user?.role === 'ADMIN' && (
          <>
            {/* Welcome */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#150f30] via-[#1e1050] to-[#0a0a20] border border-white/[0.08] p-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <p className="text-[11px] font-semibold text-purple-400/80 uppercase tracking-widest mb-1 font-syne">Admin Console</p>
              <h2 className="font-syne text-2xl font-extrabold text-white mb-1">Platform Overview</h2>
              <p className="text-sm text-white/40">Monitor all activity and manage the platform.</p>
            </div>

            {/* 4 Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={Users} label="Total Users" value={dashboardData?.totalUsers || 0} color="blue" />
              <StatsCard icon={BookOpen} label="Total Courses" value={dashboardData?.totalCourses || 0} color="purple" />
              <StatsCard icon={Award} label="Enrollments" value={dashboardData?.totalEnrollments || 0} color="green" />
              <StatsCard icon={BarChart3} label="Revenue" value={`₹${dashboardData?.totalRevenue || 0}`} color="orange" />
            </div>

            {/* 3 Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin?tab=users"
                className="group bg-white/[0.04] border border-white/[0.08] hover:border-blue-400/30 hover:bg-white/[0.06] rounded-2xl p-5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-syne font-bold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">
                  Manage Users
                </h3>
                <p className="text-xs text-text-muted">View and manage all platform users</p>
                <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              <Link
                to="/admin?tab=courses"
                className="group bg-white/[0.04] border border-white/[0.08] hover:border-purple-400/30 hover:bg-white/[0.06] rounded-2xl p-5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-syne font-bold text-white text-sm mb-1 group-hover:text-purple-300 transition-colors">
                  Manage Courses
                </h3>
                <p className="text-xs text-text-muted">Review and approve course content</p>
                <div className="flex items-center gap-1 text-purple-400 text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              <Link
                to="/admin?tab=payments"
                className="group bg-white/[0.04] border border-white/[0.08] hover:border-success/30 hover:bg-white/[0.06] rounded-2xl p-5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
                <h3 className="font-syne font-bold text-white text-sm mb-1 group-hover:text-green-300 transition-colors">
                  View Payments
                </h3>
                <p className="text-xs text-text-muted">Review all transaction history</p>
                <div className="flex items-center gap-1 text-success text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
