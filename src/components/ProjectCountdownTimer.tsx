import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface ProjectCountdownTimerProps {
  deadlineIso: string;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showWarningText?: boolean;
}

export const ProjectCountdownTimer: React.FC<ProjectCountdownTimerProps> = ({
  deadlineIso,
  onExpire,
  size = 'md',
  showWarningText = true
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(() => {
    const diff = new Date(deadlineIso).getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadlineIso).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeftMs(0);
        if (onExpire) onExpire();
      } else {
        setTimeLeftMs(diff);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso, onExpire]);

  const totalMinutes = Math.floor(timeLeftMs / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
  const formattedMinutes = String(totalMinutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Percentage of 60 minutes elapsed
  const totalDurationMs = 60 * 60 * 1000;
  const percentRemaining = Math.min(100, Math.max(0, (timeLeftMs / totalDurationMs) * 100));

  const isExpired = timeLeftMs <= 0;
  const isUrgent = timeLeftMs < 10 * 60 * 1000; // < 10 minutes

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
        isExpired 
          ? 'text-rose-500' 
          : isUrgent 
            ? 'text-amber-500 animate-pulse' 
            : 'text-blue-600'
      }`}>
        <Clock size={12} />
        {isExpired ? 'Expired (60m)' : `${formattedMinutes}:${formattedSeconds}`}
      </span>
    );
  }

  return (
    <div className={`rounded-2xl p-4 border transition-all ${
      isExpired
        ? 'bg-rose-50/80 border-rose-200 text-rose-900'
        : isUrgent
          ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm animate-pulse'
          : 'bg-blue-50/80 border-blue-200 text-blue-950 shadow-sm'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isExpired 
              ? 'bg-rose-100 text-rose-600' 
              : isUrgent 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              60-Minute Review Window
            </h4>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight flex items-baseline gap-1">
              <span>{isExpired ? '00:00' : `${formattedMinutes}:${formattedSeconds}`}</span>
              <span className="text-[11px] font-sans font-medium text-slate-500">
                {isExpired ? 'Review Expired' : 'remaining'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Gauge */}
        <div className="w-24 sm:w-32 space-y-1 text-right">
          <span className="text-[10px] font-bold text-slate-500">
            {isExpired ? '0%' : `${Math.round(percentRemaining)}% window`}
          </span>
          <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                isExpired 
                  ? 'bg-rose-500' 
                  : isUrgent 
                    ? 'bg-amber-500' 
                    : 'bg-blue-600'
              }`}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
        </div>
      </div>

      {showWarningText && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs">
          <ShieldAlert size={15} className={`shrink-0 mt-0.5 ${isExpired ? 'text-rose-600' : 'text-amber-600'}`} />
          <p className="text-[11px] leading-relaxed text-slate-600">
            {isExpired ? (
              <span className="text-rose-700 font-semibold">
                Your project was not approved within the review period and has been automatically rejected.
              </span>
            ) : (
              <span>
                <strong>Automatic Rejection Rule:</strong> Admin must manually verify your work and video proof within 60 minutes. If not approved before deadline, this submission will be automatically marked as <strong>Rejected</strong>.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
