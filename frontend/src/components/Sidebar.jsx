import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

const Sidebar = ({ lessons, currentLessonId, onSelectLesson, completedLessons = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Course Content</h3>

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
                  ? 'bg-primary-100 border-l-4 border-primary-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Icon */}
              <div className="mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Play className="w-5 h-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-primary-600' : 'text-gray-900'
                  }`}
                >
                  {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
