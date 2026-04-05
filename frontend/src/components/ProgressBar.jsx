import React from 'react';

const ProgressBar = ({ percentage = 0, label = 'Progress', showLabel = true }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isComplete = clampedPercentage === 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(clampedPercentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-primary-600'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        >
          {/* Animated shine effect */}
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      {isComplete && (
        <p className="text-xs text-green-600 font-medium mt-1">Course Completed!</p>
      )}
    </div>
  );
};

export default ProgressBar;
