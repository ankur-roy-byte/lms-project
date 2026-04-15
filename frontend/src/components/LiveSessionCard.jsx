import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Radio } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';

const LiveSessionCard = ({ session, onJoin }) => {
  const [isLive, setIsLive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const checkSessionStatus = () => {
      const now = new Date();
      const sessionDate = new Date(session.scheduledAt);
      const endDate = new Date(sessionDate.getTime() + session.duration * 60000);

      setIsLive(now >= sessionDate && now <= endDate);
      setTimeRemaining(formatDistanceToNow(sessionDate, { addSuffix: true }));
    };

    checkSessionStatus();
    const interval = setInterval(checkSessionStatus, 30000);

    return () => clearInterval(interval);
  }, [session]);

  const sessionDate = new Date(session.scheduledAt);
  const isUpcoming = !isPast(sessionDate);

  return (
    <div className="bg-brand-surface border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.04] transition-colors">
      {/* Header with Live Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg mb-1">{session.title}</h3>
          <p className="text-sm text-text-muted">{session.courseName}</p>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 bg-red-500/[0.15] text-red-400 px-3 py-1 rounded-full animate-pulse">
            <Radio className="w-3 h-3 fill-red-400" />
            <span className="text-xs font-bold">LIVE NOW</span>
          </div>
        )}
        {isUpcoming && !isLive && (
          <div className="text-[10px] font-bold text-accent bg-accent/[0.12] px-3 py-1 rounded-full font-syne">
            Upcoming
          </div>
        )}
      </div>

      {/* Session Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <User className="w-4 h-4 text-text-muted" />
          <span>{session.instructorName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span>
            {sessionDate.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4 text-text-muted" />
          <span>
            {sessionDate.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}{' '}
            ({session.duration} mins)
          </span>
        </div>
      </div>

      {/* Time Status */}
      <p className="text-xs text-text-muted mb-4">{timeRemaining}</p>

      {/* Join Button */}
      <button
        onClick={() => onJoin(session)}
        disabled={!isUpcoming && !isLive}
        className={`w-full py-2 rounded-xl font-medium text-sm transition-colors ${
          isLive
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : isUpcoming
              ? 'bg-accent hover:bg-accent-hover text-brand-bg'
              : 'bg-white/[0.04] text-text-muted cursor-not-allowed'
        }`}
      >
        {isLive ? 'Join Now - Live' : isUpcoming ? 'Join Session' : 'Session Ended'}
      </button>
    </div>
  );
};

export default LiveSessionCard;
