import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { 
  FileSpreadsheet, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  Video, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Package, 
  Receipt, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Award,
  Layers,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { DATA_ENTRY_PROJECTS, DataEntryProjectDef, downloadProjectExcel } from '../lib/dataEntryDatasets';
import { ProjectSubmissionDoc, checkAndApplyAutoRejection } from '../lib/projectSubmissionService';
import { DataEntryProjectWorkspaceModal } from '../components/DataEntryProjectWorkspaceModal';
import { ProjectCountdownTimer } from '../components/ProjectCountdownTimer';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';

export const DataEntryWork = () => {
  return (
    <ModuleGuard moduleId="data" title="Data Entry Work">
      <DataEntrySystem />
    </ModuleGuard>
  );
};

const DataEntrySystem: React.FC = () => {
  const { user, profile } = useAuth();

  // Selected project for modal
  const [selectedProject, setSelectedProject] = useState<DataEntryProjectDef | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock Warning state
  const [lockWarning, setLockWarning] = useState<string | null>(null);

  // Submissions map: projectId -> ProjectSubmissionDoc
  const [userSubmissions, setUserSubmissions] = useState<Record<string, ProjectSubmissionDoc>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Settings from Admin (e.g., video upload requirement)
  const [isVideoRequired, setIsVideoRequired] = useState(true);

  // Check if project is unlocked sequentially (1 to 10)
  const isProjectUnlocked = (proj: DataEntryProjectDef) => {
    if (proj.number === 1) return true;
    const prevProj = DATA_ENTRY_PROJECTS.find(p => p.number === proj.number - 1);
    if (!prevProj) return true;
    const prevSub = userSubmissions[prevProj.id];
    return Boolean(prevSub);
  };

  // Fetch user's submissions in real-time
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projectSubmissions'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const map: Record<string, ProjectSubmissionDoc> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const sub: ProjectSubmissionDoc = {
          id: docSnap.id,
          ...data
        };
        // If multiple submissions exist for a project, store the latest
        if (!map[sub.projectId] || new Date(sub.submissionTime || 0) > new Date(map[sub.projectId].submissionTime || 0)) {
          map[sub.projectId] = sub;
        }
      });
      setUserSubmissions(map);
    });

    // Check admin global settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'dataEntryConfig'), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d.isVideoRequired !== undefined) {
          setIsVideoRequired(d.isVideoRequired);
        }
      }
    });

    return () => {
      unsub();
      unsubSettings();
    };
  }, [user]);

  // Periodic check for 60-minute auto rejection
  useEffect(() => {
    const timer = setInterval(() => {
      (Object.values(userSubmissions) as ProjectSubmissionDoc[]).forEach((sub) => {
        if (sub.status === 'Under Review') {
          checkAndApplyAutoRejection(sub);
        }
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [userSubmissions]);

  const handleOpenWorkspace = (proj: DataEntryProjectDef) => {
    if (!isProjectUnlocked(proj)) {
      setLockWarning(`⚠️ অনুগ্রহ করে পূর্ববর্তী প্রজেক্টটি (Project #${proj.number - 1}) সম্পূর্ণ করে সাবমিট করুন। আগের কাজ জমা দেওয়া হলে এই প্রজেক্টটি স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLockWarning(null);
    setSelectedProject(proj);
    setIsModalOpen(true);
  };

  const handleFastDownload = (e: React.MouseEvent, proj: DataEntryProjectDef) => {
    e.stopPropagation();
    if (!isProjectUnlocked(proj)) {
      setLockWarning(`⚠️ অনুগ্রহ করে পূর্ববর্তী প্রজেক্টটি (Project #${proj.number - 1}) সম্পূর্ণ করে সাবমিট করুন। আগের কাজ জমা দেওয়া হলে এই প্রজেক্টটি স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLockWarning(null);
    setDownloadingId(proj.id);
    try {
      downloadProjectExcel(proj);
      setTimeout(() => setDownloadingId(null), 1500);
    } catch (err) {
      console.error(err);
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-16 font-sans">
      
      {/* Lock Warning Banner */}
      {lockWarning && (
        <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs sm:text-sm font-bold rounded-2xl flex items-start justify-between gap-3 shadow-sm animate-bounce">
          <div className="flex items-start gap-2">
            <span>⚠️</span>
            <span>{lockWarning}</span>
          </div>
          <button onClick={() => setLockWarning(null)} className="text-rose-500 hover:text-rose-800 font-extrabold px-1 cursor-pointer">X</button>
        </div>
      )}
      
      {/* 1. HERO HEADER: Professional White with Blue & Green Accents */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Layers size={14} className="text-blue-600" />
              <span>Enterprise Excel Assessment</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Data Entry Project Management System
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              ১০টি বাস্তবসম্মত কর্পোরেট ডাটা এন্ট্রি প্রজেক্ট। র ডাটাবেজ ডাউনলোড করে গাণিতিক যোগ-বিয়োগ, ৫০ টাকা কর্তন, শর্তসাপেক্ষ বোনাস ও ডাটা ক্লিনিং করে স্প্রেডশিট লিংক এবং স্ক্রিন রেকর্ডিং ভিডিও প্রমাণ সাবমিট করুন।
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
              <span className="text-lg font-black text-blue-600 block">10 Projects</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">১০টি সম্পূর্ণ প্রজেক্ট</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
              <span className="text-lg font-black text-emerald-600 block">50,000+</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">মোট ডাটা রেকর্ডস</span>
            </div>
          </div>
        </div>

        {/* Highlighted Policy Banner: Strict AI Ban & 2-Hour Review Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-rose-900">
            <Ban size={18} className="text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-rose-950">NO AI Allowed</p>
              <p className="text-[10px] text-rose-800">ChatGPT, Gemini নিষিদ্ধ। ম্যানুয়ালি এক্সেল ফর্মুলা ব্যবহার করুন।</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900">
            <Video size={18} className="text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-blue-950">স্ক্রিন ভিডিও প্রমাণ বাধ্যতামূলক</p>
              <p className="text-[10px] text-blue-800">কাজের সময় স্ক্রিন রেকর্ড করে গুগল ড্রাইভ লিংক দিন।</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
            <Clock size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-950">২ ঘণ্টা রিভিউ উইন্ডো</p>
              <p className="text-[10px] text-amber-800">সাবমিটের পর ২ ঘণ্টা পেন্ডিং থাকবে এবং স্বয়ংক্রিয় ভেরিফিকেশন চলবে।</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROJECTS LISTING GRID (All 10 Distinct Real-World Projects) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="text-blue-600" size={20} />
              নির্ধারিত ১০টি এক্সেল ডাটা এন্ট্রি প্রজেক্ট
            </h2>
            <p className="text-xs text-slate-500">
              র ডাটাবেজ ডাউনলোড করুন, নির্দেশিত গাণিতিক রূপান্তর শেষ করে স্প্রেডশিট লিংক ও স্ক্রিন ভিডিও সাবমিট করুন।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DATA_ENTRY_PROJECTS.map((proj) => {
            const sub = userSubmissions[proj.id];
            const status = sub?.status || 'Not Started';
            const isUnderReview = status === 'Under Review';
            const isAccepted = status === 'Accepted';
            const isRejected = status === 'Rejected';
            const isDownloading = downloadingId === proj.id;
            const isUnlocked = isProjectUnlocked(proj);

            return (
              <div
                key={proj.id}
                onClick={() => handleOpenWorkspace(proj)}
                className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                  !isUnlocked ? 'opacity-65 bg-slate-50/50' : ''
                }`}
              >
                {/* Top Row: Category, Difficulty, & Live Status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      Project #{proj.number} • {proj.difficulty}
                    </span>

                    {/* Status Chip */}
                    <div className="flex items-center gap-1.5">
                      {!isUnlocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-200 text-slate-500 border border-slate-300">
                          🔒 Locked
                        </span>
                      ) : isAccepted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          Accepted
                        </span>
                      ) : isUnderReview ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                          <Clock size={13} className="text-blue-600" />
                          Under Review
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                          <AlertTriangle size={13} className="text-rose-600" />
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Not Started
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {proj.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 text-slate-700">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Volume</span>
                      <strong className="font-bold text-slate-900">{proj.recordsCount}</strong>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 text-slate-700">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Estimated Time</span>
                      <strong className="font-bold text-slate-900">{proj.estimatedHours}</strong>
                    </div>
                  </div>

                  {/* If Under Review -> Show Live 60m Mini Timer */}
                  {isUnderReview && sub?.reviewDeadline && (
                    <div className="pt-2">
                      <ProjectCountdownTimer 
                        deadlineIso={sub.reviewDeadline}
                        size="sm"
                        showWarningText={false}
                        onExpire={() => checkAndApplyAutoRejection(sub)}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons: Balanced & Clean Grid Layout */}
                <div className="pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <button
                    type="button"
                    onClick={(e) => handleFastDownload(e, proj)}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold transition border border-slate-200 cursor-pointer disabled:opacity-50 text-center"
                    title="Download Raw Excel Dataset"
                  >
                    {isDownloading ? (
                      <RefreshCw size={14} className="animate-spin text-blue-600" />
                    ) : (
                      <Download size={14} className="text-blue-600" />
                    )}
                    <span>{isDownloading ? 'Downloading...' : 'Download Raw Dataset'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWorkspace(proj)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 text-center ${
                      isAccepted
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : isUnderReview
                        ? 'bg-amber-600 hover:bg-amber-700 animate-pulse'
                        : isRejected
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    }`}
                  >
                    <span>
                      {isAccepted
                        ? 'View Approved File'
                        : isUnderReview
                        ? 'Review Status (Pending)'
                        : isRejected
                        ? 'Re-submit Project'
                        : 'Open Workplace'}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DETAILED WORKSPACE / SUBMISSION MODAL */}
      {selectedProject && (
        <DataEntryProjectWorkspaceModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          existingSubmission={userSubmissions[selectedProject.id]}
          isVideoRequired={isVideoRequired}
          onSubmissionUpdated={() => {
            // refreshed automatically via Firestore onSnapshot
          }}
        />
      )}

    </div>
  );
};
