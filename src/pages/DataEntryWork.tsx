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
  ShieldCheck, 
  Award,
  Layers,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  FileCheck,
  Lock
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
      setLockWarning(`Please complete and submit Project #${proj.number - 1} first to unlock this project.`);
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
      setLockWarning(`Please complete and submit Project #${proj.number - 1} first to unlock this project.`);
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
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4 pb-24 font-sans">
      
      {/* Lock Warning Banner */}
      {lockWarning && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={15} className="text-rose-700 shrink-0 mt-0.5" />
            <span>{lockWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setLockWarning(null)}
            className="text-rose-600 hover:text-rose-800 font-semibold px-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* 1. HERO HEADER */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-medium text-[#0A4D8C] flex items-center gap-1.5">
              <Layers size={14} strokeWidth={1.75} />
              <span>Enterprise Excel Assessment</span>
            </p>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1E2329] leading-snug">
              Data Entry Project Management System
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Download raw Excel datasets, apply arithmetic formulas, BDT 50 deductions, and conditional bonuses, then submit your spreadsheet and Google Drive screen recording link.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-[#F4F5F7] border border-slate-200/80 rounded-xl px-4 py-3 text-center">
              <span className="text-base font-semibold text-[#0A4D8C] block tabular-nums">10 Projects</span>
              <span className="text-[11px] text-slate-500 font-medium">Assigned Modules</span>
            </div>
            <div className="bg-[#F4F5F7] border border-slate-200/80 rounded-xl px-4 py-3 text-center">
              <span className="text-base font-semibold text-[#0D7A5F] block tabular-nums">50,000+</span>
              <span className="text-[11px] text-slate-500 font-medium">Total Records</span>
            </div>
          </div>
        </div>

        {/* Highlighted Policy Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-rose-900">
            <Ban size={16} className="text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E2329]">No AI Allowed</p>
              <p className="text-[11px] text-slate-600 mt-0.5">AI tools are prohibited. Use manual Excel formulas only.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EEF5FC] border border-[#D4E4F7] text-[#1E2329]">
            <Video size={16} className="text-[#0A4D8C] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E2329]">Screen Video Proof Required</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Record your screen while working and submit a Google Drive link.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF7E0] border border-[#F3DFA2] text-[#5F4B16]">
            <Clock size={16} className="text-[#B47B00] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#1E2329]">2-Hour Review Window</p>
              <p className="text-[11px] text-[#5F4B16] mt-0.5">Submissions undergo a 2-hour automated audit window.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROJECTS LISTING GRID */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-base font-semibold text-[#1E2329] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="text-[#0A4D8C]" size={18} strokeWidth={1.75} />
              <span>Assigned 10 Excel Data Entry Projects</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download raw datasets, complete calculations, and submit your sheet & Drive recording link.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={`bg-white rounded-xl p-5 border border-slate-200/90 hover:border-slate-300 transition-colors cursor-pointer flex flex-col justify-between space-y-4 ${
                  !isUnlocked ? 'opacity-70 bg-slate-50/70' : ''
                }`}
              >
                {/* Top Row */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      Project #{proj.number} · {proj.difficulty}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {!isUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Lock size={13} /> Locked
                        </span>
                      ) : isAccepted ? (
                        <span className="inline-flex items-center gap-1 text-[#0D7A5F]">
                          <CheckCircle2 size={14} /> Accepted
                        </span>
                      ) : isUnderReview ? (
                        <span className="inline-flex items-center gap-1 text-[#0A4D8C]">
                          <Clock size={14} /> Under Review
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1 text-rose-700">
                          <AlertTriangle size={14} /> Rejected
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          Not Started
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-[#1E2329] leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {proj.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                    <div className="bg-[#F4F5F7] rounded-lg px-3 py-2 border border-slate-200/60">
                      <span className="text-slate-500 block text-[11px]">Volume</span>
                      <strong className="font-semibold text-[#1E2329] tabular-nums">{proj.recordsCount}</strong>
                    </div>
                    <div className="bg-[#F4F5F7] rounded-lg px-3 py-2 border border-slate-200/60">
                      <span className="text-slate-500 block text-[11px]">Estimated Time</span>
                      <strong className="font-semibold text-[#1E2329] tabular-nums">{proj.estimatedHours}</strong>
                    </div>
                  </div>

                  {/* If Under Review -> Show Live Mini Timer */}
                  {isUnderReview && sub?.reviewDeadline && (
                    <div className="pt-1">
                      <ProjectCountdownTimer 
                        deadlineIso={sub.reviewDeadline}
                        size="sm"
                        showWarningText={false}
                        onExpire={() => checkAndApplyAutoRejection(sub)}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <button
                    type="button"
                    onClick={(e) => handleFastDownload(e, proj)}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F4F5F7] hover:bg-slate-200/80 text-[#1E2329] text-xs font-medium transition border border-slate-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    title="Download Raw Excel Dataset"
                  >
                    {isDownloading ? (
                      <RefreshCw size={14} className="animate-spin text-[#0A4D8C]" />
                    ) : (
                      <Download size={14} className="text-[#0A4D8C]" />
                    )}
                    <span>{isDownloading ? 'Downloading...' : 'Download Dataset'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWorkspace(proj)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                      isAccepted
                        ? 'bg-[#0D7A5F] hover:bg-[#0A634C]'
                        : isUnderReview
                        ? 'bg-[#22262C] hover:bg-slate-800'
                        : isRejected
                        ? 'bg-rose-700 hover:bg-rose-800'
                        : 'bg-[#0A4D8C] hover:bg-[#083D70]'
                    }`}
                  >
                    <span>
                      {isAccepted
                        ? 'View Approved File'
                        : isUnderReview
                        ? 'Review Status'
                        : isRejected
                        ? 'Resubmit Project'
                        : 'Open Workspace'}
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
