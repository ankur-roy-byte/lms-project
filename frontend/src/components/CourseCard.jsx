import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, BookOpen, Clock, Play } from 'lucide-react';

// Category config: gradient + emoji
const CATEGORY_CONFIG = {
  'AI & Productivity': {
    gradient: 'from-[#1a1060] via-[#2d1b8a] to-[#1a2560]',
    emoji: '🤖',
    accent: '#5b9cf6',
  },
  'Research': {
    gradient: 'from-[#0d2040] via-[#1a3a60] to-[#0a2535]',
    emoji: '🔬',
    accent: '#4caf7d',
  },
  'Knowledge Management': {
    gradient: 'from-[#1a0d40] via-[#2d1a70] to-[#200d50]',
    emoji: '🧠',
    accent: '#a78bfa',
  },
  'Building': {
    gradient: 'from-[#251500] via-[#3a2200] to-[#1a1000]',
    emoji: '⚙️',
    accent: '#f0c040',
  },
  'Career': {
    gradient: 'from-[#1a0800] via-[#3a1200] to-[#280800]',
    emoji: '🚀',
    accent: '#e05a3a',
  },
};

const DEFAULT_CONFIG = {
  gradient: 'from-[#0f1520] via-[#1a2540] to-[#0a1020]',
  emoji: '📚',
  accent: '#F59E0B',
};

const CourseCard = ({ course, isEnrolled = false, progress = 0 }) => {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[course?.category] || DEFAULT_CONFIG;
  const lessonCount = course?.lessonCount || course?.totalLessons || 10;
  const hours = course?.totalHours || course?.duration || 20;
  const rating = course?.rating || 4.8;
  const learnerCount = course?.enrollmentCount ?? course?.studentCount ?? 487;
  const isFree = !course?.price || course?.price === 0;

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white/[0.04] border border-white/[0.08] rounded-xl hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${config.gradient} overflow-hidden flex-shrink-0`}>
        {/* Background texture dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        {/* Emoji center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300 select-none">
            {config.emoji}
          </span>
        </div>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-brand-bg fill-brand-bg ml-0.5" />
          </div>
        </div>

        {/* Category badge top-left */}
        {course?.category && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm border border-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold font-syne tracking-wide">
            {course.category}
          </div>
        )}

        {/* Price badge top-right */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold font-syne ${
          isFree
            ? 'bg-success/20 border border-success/30 text-success'
            : 'bg-accent/20 border border-accent/30 text-accent'
        }`}>
          {isFree ? 'FREE' : `₹${course.price}`}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Instructor */}
        <p className="text-[11px] text-text-muted mb-1.5 font-medium">
          {course?.instructorName || 'ZenVed Faculty'}
        </p>

        {/* Title — 2-line clamp */}
        <h3 className="font-semibold text-white mb-3 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {course?.title}
        </h3>

        {/* Lessons + Hours meta */}
        <div className="flex items-center gap-3 text-[11px] text-text-muted mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 opacity-60" />
            {lessonCount} lessons
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 opacity-60" />
            {hours}h content
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-[12px] font-semibold text-accent font-syne">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-text-muted">rating</span>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-text-muted">Progress</span>
              <span className="text-[11px] font-bold text-accent font-syne">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer: learner count + enroll button */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <Users className="w-3 h-3 opacity-60" />
            <span>{learnerCount.toLocaleString()} learners</span>
          </div>

          {isEnrolled ? (
            <span className="text-[10px] font-bold text-success bg-success/[0.12] border border-success/20 px-2.5 py-1 rounded-full font-syne">
              Enrolled
            </span>
          ) : (
            <button
              className="bg-accent hover:bg-accent-hover text-brand-bg px-3.5 py-1.5 rounded-lg text-[11px] font-bold font-syne transition-colors"
              onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.id}`); }}
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
