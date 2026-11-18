import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES } from '../lib/modules';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UnifiedAuth } from './UnifiedAuth';
import { BrandedLoader } from './BrandedLoader';

interface ModuleGuardProps {
  moduleId: string;
  title: string;
  children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleId, 
  children 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [acknowledgedWarning, setAcknowledgedWarning] = useState<boolean>(() => {
    return sessionStorage.getItem(`unity_warning_${moduleId}`) === 'true';
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#F4F5F7] flex items-center justify-center p-6">
        <BrandedLoader size="md" label="Verifying access permissions..." />
      </div>
    );
  }

  if (!user || !profile) {
    return <UnifiedAuth />;
  }

  if (profile.status === 'pending') {
    return (
      <div className="p-6 min-h-[75vh] bg-[#F4F5F7] flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-200 p-7 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.05)] max-w-sm w-full space-y-4">
          <div className="w-12 h-12 bg-[#FEF7E0] border border-[#F3DFA2] text-amber-600 rounded-xl flex items-center justify-center mx-auto">
            <Clock size={24} strokeWidth={1.75} />
          </div>
          <h2 className="text-base font-semibold text-[#1E2329]">Account Pending Review</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your registration is currently under administrator review. Once approved and assigned to a work module, access will be enabled here.
          </p>
          <div className="bg-[#F4F5F7] p-3 rounded-lg text-xs text-slate-700 font-mono border border-slate-200">
            Member ID: {profile.studentIdCode}
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === 'blocked') {
    return (
      <div className="p-6 min-h-[75vh] bg-[#F4F5F7] flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-200 p-7 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.05)] max-w-sm w-full space-y-4">
          <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
            <AlertTriangle size={24} strokeWidth={1.75} />
          </div>
          <h2 className="text-base font-semibold text-[#1E2329]">Account Deactivated</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Access to this account has been suspended by an administrator. Please contact official support for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (profile.role === 'admin') {
    return <>{children}</>;
  }

  const authorizedModules: string[] = (profile.assignedJobs && profile.assignedJobs.length > 0)
    ? profile.assignedJobs
    : (profile.assignedJob ? [profile.assignedJob] : []);

  const isAssignedToThisModule = authorizedModules.includes(moduleId);

  if (!isAssignedToThisModule) {
    const authorizedList = WORK_MODULES.filter(m => authorizedModules.includes(m.id));

    return (
      <div className="p-6 min-h-[75vh] bg-[#F4F5F7] flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-200 p-7 rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.05)] max-w-sm w-full space-y-5">
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mx-auto border border-slate-200">
            <Lock size={22} strokeWidth={1.75} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#1E2329]">Module Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1">This section is restricted to authorized assignments.</p>
          </div>

          <div className="bg-[#F4F5F7] p-4 rounded-lg border border-slate-200 text-left space-y-2">
            <div className="text-xs text-slate-600 font-semibold">
              Your Assigned Work Modules
            </div>
            {authorizedList.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {authorizedList.map(mod => (
                  <div key={mod.id} className="text-xs font-medium text-[#0A4D8C] flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> {mod.title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-700 font-medium">
                No work module has been assigned to your account yet.
              </p>
            )}
          </div>

          {authorizedList.length > 0 && (
            <div className="space-y-2">
              {authorizedList.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => navigate(mod.route)}
                  className="w-full bg-[#0A4D8C] hover:bg-[#083E72] text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <span>Open {mod.title}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition text-xs cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!acknowledgedWarning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white rounded-xl p-6 max-w-md w-full border border-slate-200 shadow-lg space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FEF7E0] border border-[#F3DFA2] text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1E2329]">
                সতর্কতা ও কাজের নির্দেশিকা
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Work Competency Notice</p>
            </div>
          </div>

          <div className="bg-[#FEF7E0] border border-[#F3DFA2] rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>
              এই কাজটি শুধুমাত্র যারা কোর্স সম্পন্ন করেছে বা যাদের কাজ সম্পর্কে সঠিক দক্ষতা রয়েছে তাদের জন্য।
            </p>
            <p>
              কাজ সম্পর্কে পূর্ব ধারণা না থাকলে বা ভুল তথ্য সাবমিট করলে সম্পূর্ণ ব্যাচ রিভিউতে বাতিল হয়ে যাবে।
            </p>
          </div>

          <button
            onClick={() => {
              setAcknowledgedWarning(true);
              sessionStorage.setItem(`unity_warning_${moduleId}`, 'true');
            }}
            className="w-full bg-[#0A4D8C] hover:bg-[#083E72] text-white font-medium py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <span>আমি বুঝেছি, কাজ শুরু করুন</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
