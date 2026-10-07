import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES, getModuleTitle } from '../lib/modules';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, Clock, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UnifiedAuth } from './UnifiedAuth';

interface ModuleGuardProps {
  moduleId: string;
  title: string;
  children: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleId, 
  title, 
  children 
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Skill warning modal state
  const [acknowledgedWarning, setAcknowledgedWarning] = useState<boolean>(() => {
    return sessionStorage.getItem(`unity_warning_${moduleId}`) === 'true';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-xs text-slate-500 font-medium">Verifying authorization...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Unified Auth
  if (!user || !profile) {
    return <UnifiedAuth />;
  }

  // Check user approval status
  if (profile.status === 'pending') {
    return (
      <div className="p-6 min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Account Under Review</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your registration is currently pending review by the system administrator. 
            Once your application is approved and a work module is assigned to your account, you will be able to access your tasks.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 font-mono">
            Applicant ID: {profile.studentIdCode}
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === 'blocked') {
    return (
      <div className="p-6 min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Account Deactivated</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your account access has been suspended by the administrator. Please contact system support for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Admin has access to all modules
  if (profile.role === 'admin') {
    return <>{children}</>;
  }

  // User is active: Check if user is assigned to this module
  const authorizedModules: string[] = (profile.assignedJobs && profile.assignedJobs.length > 0)
    ? profile.assignedJobs
    : (profile.assignedJob ? [profile.assignedJob] : []);

  const isAssignedToThisModule = authorizedModules.includes(moduleId);

  if (!isAssignedToThisModule) {
    const authorizedList = WORK_MODULES.filter(m => authorizedModules.includes(m.id));

    return (
      <div className="p-6 min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl max-w-sm w-full space-y-5">
          
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-inner">
            <Lock size={32} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">Module Access Restricted</h2>
            <p className="text-xs text-slate-400 mt-1">Admin Assignment Security Policy</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2">
            <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
              Your Authorized Work Task(s):
            </div>
            {authorizedList.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {authorizedList.map(mod => (
                  <div key={mod.id} className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                    <span>★</span> {mod.title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-600 font-medium">
                Administrator has not assigned this work module to your account yet.
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-200">
              The administrator has authorized your account exclusively for the tasks selected above.
            </p>
          </div>

          {authorizedList.length > 0 && (
            <div className="space-y-2">
              {authorizedList.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => navigate(mod.route)}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md text-xs cursor-pointer"
                >
                  Open {mod.title} <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition text-xs cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Authorized! Show Mandatory Skill & Competency Warning Popup if not yet acknowledged
  if (!acknowledgedWarning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Mandatory Skill & Competency Notice
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              সতর্কতা ও কাজের নির্দেশিকা
            </h2>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 leading-relaxed text-left space-y-2 font-medium">
            <p>
              এই কাজটি শুধুমাত্র যারা কোর্স করেছে বা যাদের কাজ সম্পর্কে ভালো দক্ষতা রয়েছে শুধু তাদের জন্য।
            </p>
            <p>
              আপনার যদি কাজ সম্পর্কে কোনো ধারণা না থাকে বা কাজ যদি আপনি না পেরে থাকেন (যেমন ডাটা এন্ট্রি বা টাইপিং জব), ভুল কাজ সাবমিট করলে আপনার কাজটি রিজেক্ট হয়ে যাবে।
            </p>
          </div>

          <button
            onClick={() => {
              setAcknowledgedWarning(true);
              sessionStorage.setItem(`unity_warning_${moduleId}`, 'true');
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>আমি বুঝেছি, কাজ শুরু করুন</span>
          </button>
        </div>
      </div>
    );
  }

  // Authorized & Acknowledged!
  return <>{children}</>;
};
