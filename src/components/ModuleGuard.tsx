import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { WORK_MODULES, getModuleTitle } from '../lib/modules';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
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

  // User is active: Check if user is assigned to this module (supports single or multiple assigned jobs)
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
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md text-xs"
                >
                  Open {mod.title} <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition text-xs"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Authorized for this module!
  return <>{children}</>;
};
