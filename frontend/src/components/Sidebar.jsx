import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

const Sidebar = ({ lessons, currentLessonId, onSelectLesson, completedLessons = [] }) => {
  return (
    <div className="bg-brand-surface border border-white/[0.08] rounded-xl p-6 h-fit sticky top-20">
      <h3 className="font-bold text-white mb-4 text-lg font-syne">Course Content</h3>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                isCurrent
                  ? 'bg-accent/[0.1] border-l-4 border-accent'
                  : 'hover:bg-white/[0.04]'
              }`}
            >
              {/* Icon */}
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                ) : isCurrent ? (
                  <Play className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {lesson.duration} mins
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
