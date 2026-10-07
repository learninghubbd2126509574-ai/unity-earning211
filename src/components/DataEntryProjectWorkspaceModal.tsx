import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Video, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  FileCheck,
  RefreshCw,
  Info,
  AlertCircle,
  Link2,
  Check,
  Cpu,
  Activity,
  RotateCcw
} from 'lucide-react';
import { DataEntryProjectDef, downloadProjectExcel } from '../lib/dataEntryDatasets';
import { ProjectSubmissionDoc, submitDataEntryProject, checkAndApplyAutoRejection } from '../lib/projectSubmissionService';
import { ProjectCountdownTimer } from './ProjectCountdownTimer';
import { useAuth } from '../contexts/AuthContext';

interface WorkspaceModalProps {
  project: DataEntryProjectDef;
  isOpen: boolean;
  onClose: () => void;
  existingSubmission?: ProjectSubmissionDoc | null;
  onSubmissionUpdated?: () => void;
  isVideoRequired?: boolean;
}

export const DataEntryProjectWorkspaceModal: React.FC<WorkspaceModalProps> = ({
  project,
  isOpen,
  onClose,
  existingSubmission,
  onSubmissionUpdated,
  isVideoRequired = true
}) => {
  const { user, profile } = useAuth();

  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');
  
  // Submission Form State
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentSubmission, setCurrentSubmission] = useState<ProjectSubmissionDoc | null>(existingSubmission || null);

  // 10-Project Audit & Rejection States
  const [isAnalyzing10Batch, setIsAnalyzing10Batch] = useState(false);
  const [analysis10Progress, setAnalysis10Progress] = useState(0);
  const [analysisRemainingSeconds, setAnalysisRemainingSeconds] = useState(120);
  const [analysisStepText, setAnalysisStepText] = useState('১০টি ডাটা এন্ট্রি প্রজেক্টের সামগ্রিক ডাটা অডিট শুরু হয়েছে...');

  // 120-second verification timer simulation for Data Entry Batch 10
  useEffect(() => {
    let timer: any = null;
    if (isAnalyzing10Batch) {
      setAnalysis10Progress(0);
      setAnalysisRemainingSeconds(120);
      setAnalysisStepText('১০টি ডাটা এন্ট্রি প্রজেক্টের সামগ্রিক ডাটা অডিট শুরু হয়েছে...');

      timer = setInterval(() => {
        setAnalysisRemainingSeconds(prev => {
          const nextSec = prev - 1;
          const pct = Math.min(100, Math.round(((120 - nextSec) / 120) * 100));
          setAnalysis10Progress(pct);

          if (pct < 15) {
            setAnalysisStepText('১০টি প্রজেক্ট ফাইলের সেল রেঞ্জ, ফর্মুলা সামঞ্জস্য ও নকল ডাটা এন্ট্রি ভ্যালিডেশন শুরু হয়েছে...');
          } else if (pct < 35) {
            setAnalysisStepText('কেন্দ্রীয় ডাটা ভ্যালিডেশন চেকারের সাহায্যে স্প্রেডশিট ফাইলে ক্যালকুলেশন অমিল বিশ্লেষণ চলছে...');
          } else if (pct < 55) {
            setAnalysisStepText('৫০ টাকা কর্তন নীতিমালার শর্ত এবং বোনাস গণনার সঠিকতা স্ক্যান করা হচ্ছে...');
          } else if (pct < 75) {
            setAnalysisStepText('সাবমিটকৃত স্ক্রিন রেকর্ডিং এবং ভিডিও প্রমাণের সত্যতা ভেরিফিকেশন চলছে...');
          } else if (pct < 90) {
            setAnalysisStepText('কৃত্রিম বুদ্ধিমত্তা (AI) বা অটোমেটেড স্প্রেডশিট স্ক্রিপ্টিং চেকিং চলছে...');
          } else {
            setAnalysisStepText('অডিট সম্পন্ন! সেন্ট্রাল কোয়ালিটি ফলাফল প্রস্তুত হচ্ছে...');
          }

          if (nextSec <= 0) {
            clearInterval(timer);
            setIsAnalyzing10Batch(false);
            const now = new Date();
            const finalExcelRef = spreadsheetUrl.trim() || (excelFile ? excelFile.name : 'Shared Spreadsheet Link');
            const rejectedDoc: ProjectSubmissionDoc = {
              id: 'auto-rej-10-' + Date.now(),
              projectId: project.id,
              projectNumber: project.number,
              projectTitle: project.title,
              userId: user?.uid || 'anonymous',
              participantName: profile?.fullName || 'Participant',
              participantPhone: profile?.whatsappNumber || '',
              status: 'Rejected',
              submissionTime: now.toISOString(),
              rejectionTime: now.toISOString(),
              autoRejected: true,
              videoSubmitted: Boolean(videoFile || videoUrl.trim()),
              videoUrl: videoUrl.trim(),
              videoFileName: videoFile?.name || '',
              excelFileName: finalExcelRef,
              notes: submissionNotes.trim()
            };
            setCurrentSubmission(rejectedDoc);
            if (onSubmissionUpdated) onSubmissionUpdated();
            return 0;
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnalyzing10Batch, spreadsheetUrl, videoUrl, videoFile, excelFile, submissionNotes, project, user, profile, onSubmissionUpdated]);

  useEffect(() => {
    setCurrentSubmission(existingSubmission || null);
  }, [existingSubmission]);

  // Periodically check for 120-minute (2 hour) auto rejection if under review
  useEffect(() => {
    if (currentSubmission?.status === 'Under Review') {
      const checkTimer = setInterval(async () => {
        const checked = await checkAndApplyAutoRejection(currentSubmission);
        if (checked.status !== currentSubmission.status) {
          setCurrentSubmission(checked);
          if (onSubmissionUpdated) onSubmissionUpdated();
        }
      }, 5000);
      return () => clearInterval(checkTimer);
    }
  }, [currentSubmission, onSubmissionUpdated]);

  if (!isOpen) return null;

  const handleDownloadDataset = () => {
    setDownloading(true);
    setDownloadMsg('Preparing Excel dataset...');
    try {
      downloadProjectExcel(project, (msg) => setDownloadMsg(msg));
      setTimeout(() => {
        setDownloading(false);
        setDownloadMsg('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setDownloading(false);
      setDownloadMsg('Download failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitError('');

    if (!spreadsheetUrl.trim() && !excelFile) {
      setSubmitError('Please provide your completed Google Sheets / Spreadsheet link OR upload the .xlsx file.');
      return;
    }

    if (isVideoRequired && !videoUrl.trim() && !videoFile) {
      setSubmitError('Mandatory Screen Recording Video Link (Google Drive / Loom / Dropbox) is required to prove authenticity.');
      return;
    }

    setSubmitting(true);
    try {
      const finalExcelRef = spreadsheetUrl.trim() || (excelFile ? excelFile.name : 'Shared Spreadsheet Link');
      const subId = await submitDataEntryProject({
        projectId: project.id,
        projectNumber: project.number,
        projectTitle: project.title,
        userId: user.uid,
        participantName: profile?.fullName || 'Participant',
        participantPhone: profile?.whatsappNumber || '',
        participantEmail: profile?.email || user.email || '',
        studentIdCode: profile?.studentIdCode || '',
        excelFileName: finalExcelRef,
        videoUrl: videoUrl.trim(),
        videoFileName: videoFile ? videoFile.name : (videoUrl ? 'Cloud Screen Recording Attached' : ''),
        notes: `Spreadsheet Link: ${spreadsheetUrl.trim()}\nNotes: ${submissionNotes.trim()}`
      });

      // Auto-rejection after 10th project submission with realistic audit loading
      if (project.number === 10) {
        setIsAnalyzing10Batch(true);
        return;
      }

      // Update local state to Under Review with 120-minute (2 hours) deadline
      const now = new Date();
      const deadline = new Date(now.getTime() + 120 * 60 * 1000).toISOString();
      const updated: ProjectSubmissionDoc = {
        id: subId,
        projectId: project.id,
        projectNumber: project.number,
        projectTitle: project.title,
        userId: user.uid,
        participantName: profile?.fullName || 'Participant',
        participantPhone: profile?.whatsappNumber || '',
        status: 'Under Review',
        submissionTime: now.toISOString(),
        reviewDeadline: deadline,
        videoSubmitted: Boolean(videoFile || videoUrl.trim()),
        videoUrl: videoUrl.trim(),
        videoFileName: videoFile?.name || '',
        excelFileName: finalExcelRef,
        notes: submissionNotes.trim()
      };

      setCurrentSubmission(updated);
      if (onSubmissionUpdated) onSubmissionUpdated();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err?.message || 'Failed to submit project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatus = currentSubmission?.status || 'Not Started';
  const isRejected = currentStatus === 'Rejected';
  const isAccepted = currentStatus === 'Accepted';
  const isUnderReview = currentStatus === 'Under Review';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Header - Clean, No Scrollbars */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 sm:px-8 py-5 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {project.difficulty} Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {project.recordsCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Est. {project.estimatedHours}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              {project.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              {project.subtitle} • {project.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Close Workplace"
          >
            <X size={18} />
          </button>
        </div>

        {/* Single Seamless Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-slate-50/50">

          {/* STATUS NOTICES (IF UNDER REVIEW / ACCEPTED / REJECTED) */}
          {isUnderReview && currentSubmission?.reviewDeadline && (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-2 border-blue-300 rounded-3xl p-6 text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Clock size={28} className="animate-spin-slow" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 inline-block">
                  Submission Status: Under Review (পেন্ডিং রিভিউ)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Your Project Submission is Currently Under Review
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Your completed spreadsheet link and screen recording video proof have been submitted to the admin panel. The review period lasts up to 2 hours.
                </p>
              </div>

              <ProjectCountdownTimer 
                deadlineIso={currentSubmission.reviewDeadline}
                onExpire={async () => {
                  const updated = await checkAndApplyAutoRejection(currentSubmission);
                  setCurrentSubmission(updated);
                  if (onSubmissionUpdated) onSubmissionUpdated();
                }}
              />
            </div>
          )}

          {isAccepted && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-7 text-center space-y-3 shadow-xl animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black">
                🎉 Project Submission Approved & Verified!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-md mx-auto">
                Congratulations! The administrator verified your Excel formulas and screen recording video. Your earnings have been credited.
              </p>
            </div>
          )}

          {/* 10-Project Audit Loading Screen */}
          {isAnalyzing10Batch && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border border-slate-800 animate-in zoom-in-95">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg relative z-10">
                  <Cpu size={24} className="text-white animate-pulse" />
                </div>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  <Activity size={12} className="animate-pulse" />
                  <span>Central Spreadsheet Audit In Progress</span>
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  ১০টি ডাটা এন্ট্রি প্রজেক্টের সেন্ট্রাল অডিট ও স্প্রেডশিট ভেরিফিকেশন চলছে...
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {analysisStepText} ({analysis10Progress}%)
                </p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysis10Progress}%` }}
                ></div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 bg-slate-950/40 py-2 px-4 rounded-xl border border-slate-850 max-w-xs mx-auto">
                <Clock size={12} className="text-orange-400 animate-pulse" />
                <span className="font-semibold text-orange-400 font-mono">
                  ভেরিফিকেশন সম্পন্ন হতে বাকি: {Math.floor(analysisRemainingSeconds / 60)} মিনিট {analysisRemainingSeconds % 60} সেকেন্ড
                </span>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 text-center space-y-2 text-rose-950 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-black text-rose-900">
                সিস্টেম ডিটেকশনে আপনার ডাটা এন্ট্রি প্রজেক্ট ব্যাচটি রিজেক্টেড (Rejected) হয়েছে!
              </h3>
              <p className="text-xs text-rose-700 max-w-lg mx-auto leading-relaxed">
                আমাদের সেন্ট্রাল ডাটা ভ্যালিডেশন চেকার ও সিস্টেম ডিটেকশনে আপনার সাবমিটকৃত স্প্রেডশিট ফাইলে একাধিক ফর্মুলা ক্যালকুলেশন অমিল, নকল সেল ডাটা ও অসম্পূর্ণ রেকর্ড শনাক্ত হয়েছে। ৫০ টাকা কর্তন ও বোনাস গণনার নিয়মাবলি ভঙ্গ করায় প্রজেক্টটি বাতিল করা হয়েছে। নির্দেশিকা অনুসরণ করে পুনরায় প্রথম থেকে নির্ভুলভাবে চেষ্টা করুন।
              </p>
            </div>
          )}

          {/* STEP 1: DOWNLOAD RAW DATASET BANNER */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Download Raw Project Database (.xlsx)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {project.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDataset}
                disabled={downloading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95 cursor-pointer shrink-0 disabled:opacity-50 w-full sm:w-auto"
              >
                {downloading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                <span>{downloading ? 'Generating Excel File...' : 'Download Raw Dataset (.xlsx)'}</span>
              </button>
            </div>

            {downloadMsg && (
              <p className="text-xs font-semibold text-blue-600 animate-pulse">
                ℹ️ {downloadMsg}
              </p>
            )}
          </div>

          {/* STEP 2: CLEAR STEP-BY-STEP CALCULATION TASKS & INSTRUCTIONS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">2</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Required Practical Calculation & Data Cleaning Instructions
                </h3>
                <p className="text-xs text-slate-500">
                  Follow these exact mathematical operations and formula rules in your spreadsheet:
                </p>
              </div>
            </div>

            {/* List of Tasks */}
            <div className="grid grid-cols-1 gap-2.5">
              {project.tasks.map((task, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 text-xs leading-relaxed text-slate-800"
                >
                  <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0 text-[10px] mt-0.5">
                    {index + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="font-medium text-slate-900">{task}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Included Columns & Expected Sheets Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100 space-y-2">
                <span className="text-[11px] font-bold text-blue-900 block flex items-center gap-1.5">
                  <FileSpreadsheet size={14} className="text-blue-600" /> Included Columns ({project.columns.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {project.columns.map(col => (
                    <span key={col} className="px-2 py-0.5 rounded-lg bg-white text-slate-700 text-[10px] font-medium border border-blue-200">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/60 rounded-2xl p-3.5 border border-emerald-100 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 block flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" /> Expected Output Worksheets
                </span>
                <div className="flex flex-wrap gap-1">
                  {project.expectedSheets.map(sheet => (
                    <span key={sheet} className="px-2 py-0.5 rounded-lg bg-white text-emerald-900 text-[10px] font-mono border border-emerald-200">
                      {sheet}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: SUBMIT COMPLETED WORK FORM (ALWAYS VISIBLE & PROMINENT) */}
          {!isUnderReview && !isAccepted && (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-200 shadow-md space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">3</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Submit Completed Project & Screen Recording Proof
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste your shared Google Sheets link and screen recording video link below:
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3.5 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Input 1: Completed Spreadsheet Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Completed Google Sheets / OneDrive Cloud Link <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="url"
                    required={!excelFile}
                    placeholder="https://docs.google.com/spreadsheets/d/... (Make sure link access is 'Anyone with link can view/edit')"
                    value={spreadsheetUrl}
                    onChange={(e) => setSpreadsheetUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <Link2 size={15} className="absolute left-3 top-3 text-slate-400" />
                </div>

                {/* Direct file fallback */}
                <div className="pt-1 flex items-center gap-2">
                  <label className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 cursor-pointer flex items-center gap-1.5">
                    <Upload size={12} />
                    <span>Or Upload .xlsx File Directly</span>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden" 
                    />
                  </label>
                  {excelFile && (
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-xs">
                      ✓ {excelFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Input 2: Screen Recording Video Link */}
              {isVideoRequired && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Screen Recording Video Proof Link (Google Drive / Loom / Dropbox) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Anti-AI Proof
                    </span>
                  </div>

                  <div className="relative">
                    <input 
                      type="url"
                      required={!videoFile}
                      placeholder="https://drive.google.com/file/d/... অথবা https://www.loom.com/share/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <Video size={15} className="absolute left-3 top-3 text-slate-400" />
                  </div>

                  {/* Direct video file upload fallback */}
                  <div className="pt-1 flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5">
                      <Upload size={12} />
                      <span>Or Upload Video File Directly (MP4, WebM)</span>
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="hidden" 
                      />
                    </label>
                    {videoFile && (
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 truncate max-w-xs">
                        ✓ {videoFile.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Input 3: Work Process Notes */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  Work Process Notes & Used Formulas (Optional)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Mention formulas used (e.g. SUM, IF condition, VLOOKUP, BDT 50 deduction)..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Final Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>{submitting ? 'Submitting & Initiating 2-Hour Review...' : 'Submit Project for Admin Review'}</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  * Submission will immediately start a 2-hour pending review window in the admin queue.
                </p>
              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white border-t border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-blue-600" />
            <span>Project Ref: <strong className="font-mono text-slate-700">{project.id}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
          >
            Close Workplace
          </button>
        </div>

      </div>
    </div>
  );
};
