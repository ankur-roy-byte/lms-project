import React from 'react';

const ProgressBar = ({ percentage = 0, label = 'Progress', showLabel = true }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const isComplete = clampedPercentage === 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          <span className="text-sm font-semibold text-accent font-syne">{Math.round(clampedPercentage)}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-success' : 'bg-accent'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse rounded-full"></div>
        </div>
      </div>
      {isComplete && (
        <p className="text-xs text-success font-medium mt-1">Course Completed!</p>
      )}
    </div>
  );
};

export default ProgressBar;
