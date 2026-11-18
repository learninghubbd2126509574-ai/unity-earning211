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
      <span
        className={`inline-flex items-center gap-1.5 font-mono font-semibold text-xs tabular-nums ${
          isExpired
            ? 'text-rose-700'
            : isUrgent
              ? 'text-[#B47B00]'
              : 'text-[#0A4D8C]'
        }`}
      >
        <Clock size={12} />
        {isExpired ? 'Expired (60m)' : `${formattedMinutes}:${formattedSeconds}`}
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl p-4 border transition-colors ${
        isExpired
          ? 'bg-rose-50 border-rose-200 text-[#1E2329]'
          : isUrgent
            ? 'bg-[#FEF7E0] border-[#F3DFA2] text-[#5F4B16]'
            : 'bg-[#EEF5FC] border-[#D4E4F7] text-[#1E2329]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isExpired
                ? 'bg-rose-100 text-rose-700'
                : isUrgent
                  ? 'bg-amber-100 text-[#B47B00]'
                  : 'bg-white border border-[#D4E4F7] text-[#0A4D8C]'
            }`}
          >
            <Clock size={18} strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-600">
              60-Minute Review Window
            </h4>
            <div className="text-lg sm:text-xl font-semibold font-mono tabular-nums tracking-tight flex items-baseline gap-1.5 text-[#1E2329]">
              <span>{isExpired ? '00:00' : `${formattedMinutes}:${formattedSeconds}`}</span>
              <span className="text-xs font-sans font-normal text-slate-500">
                {isExpired ? 'Review Expired' : 'remaining'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Gauge */}
        <div className="w-24 sm:w-32 space-y-1 text-right">
          <span className="text-[11px] font-medium text-slate-600 tabular-nums">
            {isExpired ? '0%' : `${Math.round(percentRemaining)}% window`}
          </span>
          <div className="h-2 w-full bg-white/80 border border-slate-200/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isExpired
                  ? 'bg-rose-600'
                  : isUrgent
                    ? 'bg-[#B47B00]'
                    : 'bg-[#0A4D8C]'
              }`}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
        </div>
      </div>

      {showWarningText && (
        <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-start gap-2 text-xs">
          <ShieldAlert size={15} className={`shrink-0 mt-0.5 ${isExpired ? 'text-rose-700' : 'text-[#B47B00]'}`} />
          <p className="text-xs leading-relaxed text-slate-600">
            {isExpired ? (
              <span className="text-rose-700 font-medium">
                Your project was not approved within the review period and has been automatically rejected.
              </span>
            ) : (
              <span>
                <strong className="font-semibold text-[#1E2329]">Automatic Rejection Rule:</strong> Admin must verify your work and video proof within 60 minutes. If not approved before the deadline, this submission will be marked as Rejected.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
