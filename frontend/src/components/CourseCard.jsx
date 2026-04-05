import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

const CourseCard = ({ course, isEnrolled = false, progress = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-[#1a2540] to-[#243050] overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-3xl">{course.title?.charAt(0)}</span>
          </div>
        )}
        {course.category && (
          <div className="absolute top-3 right-3 bg-accent text-brand-bg px-3 py-1 rounded-full text-[10px] font-bold font-syne">
            {course.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-white mb-1 line-clamp-2 text-sm">
          {course.title}
        </h3>

        <p className="text-[11px] text-text-muted mb-3">
          {course.instructorName || 'Instructor'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-text-muted mb-3">
          {course.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.enrollmentCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.enrollmentCount}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isEnrolled && progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-medium text-text-secondary">Progress</span>
              <span className="text-[11px] text-accent font-bold font-syne">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Price & Button */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-bold text-white font-syne">
            {course.price === 0 || !course.price ? 'Free' : `₹${course.price}`}
          </span>
          {!isEnrolled && (
            <button className="bg-accent hover:bg-accent-hover text-brand-bg px-3 py-1 rounded-lg text-[11px] font-bold font-syne transition">
              Enroll
            </button>
          )}
          {isEnrolled && (
            <span className="text-[10px] font-semibold text-success bg-success/[0.12] px-2 py-1 rounded-lg font-syne">
              Enrolled
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
