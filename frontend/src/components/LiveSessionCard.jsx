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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header with Live Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{session.title}</h3>
          <p className="text-sm text-gray-600">{session.courseName}</p>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full animate-pulse">
            <Radio className="w-3 h-3 fill-red-700" />
            <span className="text-xs font-bold">LIVE NOW</span>
          </div>
        )}
        {isUpcoming && !isLive && (
          <div className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            Upcoming
          </div>
        )}
      </div>

      {/* Session Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="w-4 h-4 text-gray-500" />
          <span>{session.instructorName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            {sessionDate.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-gray-500" />
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
      <p className="text-xs text-gray-500 mb-4">{timeRemaining}</p>

      {/* Join Button */}
      <button
        onClick={() => onJoin(session)}
        disabled={!isUpcoming && !isLive}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          isLive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : isUpcoming
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isLive ? 'Join Now - Live' : isUpcoming ? 'Join Session' : 'Session Ended'}
      </button>
    </div>
  );
};

export default LiveSessionCard;
