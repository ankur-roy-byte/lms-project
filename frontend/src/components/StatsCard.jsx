import React from 'react';

const StatsCard = ({ icon: Icon, label, value, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-accent/[0.12] text-accent',
    green: 'bg-success/[0.12] text-success',
    purple: 'bg-purple-500/[0.12] text-purple-400',
    blue: 'bg-blue-500/[0.12] text-blue-400',
    orange: 'bg-accent/[0.12] text-accent',
    red: 'bg-red-500/[0.12] text-red-400',
  };

  return (
    <div className="card hover:bg-white/[0.06] transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-text-muted text-[11px] font-medium mb-1">{label}</p>
          <p className="text-2xl font-extrabold text-white font-syne">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
