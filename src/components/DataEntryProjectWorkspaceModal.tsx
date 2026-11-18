import React, { useState, useEffect, useMemo } from 'react';
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
  FileCheck,
  RefreshCw,
  Info,
  AlertCircle,
  Link2,
  Check,
  Cpu,
  RotateCcw,
  Users,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DataEntryProjectDef, downloadProjectExcel, getProjectSampleRecords } from '../lib/dataEntryDatasets';
import { ProjectSubmissionDoc, submitDataEntryProject, checkAndApplyAutoRejection } from '../lib/projectSubmissionService';
import { ProjectCountdownTimer } from './ProjectCountdownTimer';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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
  const [showClientPreview, setShowClientPreview] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(0);

  const sampleClientRecords = useMemo(() => {
    return getProjectSampleRecords(project, 8);
  }, [project]);

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
  const [pendingBatchSubId, setPendingBatchSubId] = useState<string | null>(null);
  const [analysis10Progress, setAnalysis10Progress] = useState(0);
  const [analysisRemainingSeconds, setAnalysisRemainingSeconds] = useState(120);
  const [analysisStepText, setAnalysisStepText] = useState('Initializing 10-project spreadsheet audit...');

  // 120-second verification timer simulation for Data Entry Batch 10
  useEffect(() => {
    let timer: any = null;
    if (isAnalyzing10Batch) {
      setAnalysis10Progress(0);
      setAnalysisRemainingSeconds(120);
      setAnalysisStepText('Initializing 10-project spreadsheet audit...');

      timer = setInterval(() => {
        setAnalysisRemainingSeconds(prev => {
          const nextSec = prev - 1;
          const pct = Math.min(100, Math.round(((120 - nextSec) / 120) * 100));
          setAnalysis10Progress(pct);

          if (pct < 15) {
            setAnalysisStepText('Validating cell ranges, formula integrity & missing records...');
          } else if (pct < 35) {
            setAnalysisStepText('Running central data validation checks across spreadsheets...');
          } else if (pct < 55) {
            setAnalysisStepText('Auditing BDT 50 deduction logic & bonus formula rules...');
          } else if (pct < 75) {
            setAnalysisStepText('Verifying Google Drive screen recording video proof...');
          } else if (pct < 90) {
            setAnalysisStepText('Scanning for missing cells, empty formulas & sheet discrepancies...');
          } else {
            setAnalysisStepText('Audit complete. Compiling Missing Data & Quality Control findings...');
          }

          if (nextSec <= 0) {
            clearInterval(timer);
            setIsAnalyzing10Batch(false);
            const now = new Date();
            const nowIso = now.toISOString();
            const finalExcelRef = spreadsheetUrl.trim() || (excelFile ? excelFile.name : 'Shared Spreadsheet Link');
            const missingDataReason = `Missing Data & Formula Error in ${project.title}: আপনার এই জায়গায় মিসিং ডেটা ও ভুল রয়েছে (Row #14–#38 ${project.columns[project.columns.length - 1] || 'Net Total'} Cell Missing / BDT 50 Deduction Formula Mismatch)।`;

            if (pendingBatchSubId) {
              updateDoc(doc(db, 'projectSubmissions', pendingBatchSubId), {
                status: 'Rejected',
                rejectionTime: nowIso,
                autoRejected: true,
                rejectionReason: missingDataReason,
                updatedAt: nowIso
              }).catch((err) => console.error('Failed to persist batch rejection:', err));
            }

            const rejectedDoc: ProjectSubmissionDoc = {
              id: pendingBatchSubId || ('auto-rej-10-' + Date.now()),
              projectId: project.id,
              projectNumber: project.number,
              projectTitle: project.title,
              userId: user?.uid || 'anonymous',
              participantName: profile?.fullName || 'Participant',
              participantPhone: profile?.whatsappNumber || '',
              status: 'Rejected',
              submissionTime: nowIso,
              rejectionTime: nowIso,
              rejectionReason: missingDataReason,
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
  }, [isAnalyzing10Batch, pendingBatchSubId, spreadsheetUrl, videoUrl, videoFile, excelFile, submissionNotes, project, user, profile, onSubmissionUpdated]);

  useEffect(() => {
    setCurrentSubmission(existingSubmission || null);
    setPreviewIndex(0);
  }, [existingSubmission, project.id]);

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
        setPendingBatchSubId(subId);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] shadow-xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#0A4D8C] text-white px-5 sm:px-6 py-4.5 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#D4E4F7] tabular-nums">
              {project.difficulty} Level · {project.recordsCount} · Est. {project.estimatedHours}
            </p>

            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
              {project.title}
            </h2>
            <p className="text-xs text-blue-100/90 max-w-xl">
              {project.subtitle} · {project.category}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Close Workspace"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F4F5F7]">

          {/* STATUS NOTICES */}
          {isUnderReview && currentSubmission?.reviewDeadline && (
            <div className="space-y-3">
              <div className="bg-[#EEF5FC] border border-[#D4E4F7] rounded-xl p-5 text-center space-y-2">
                <div className="w-11 h-11 rounded-xl bg-[#0A4D8C] text-white flex items-center justify-center mx-auto">
                  <Clock size={22} />
                </div>
                <p className="text-xs font-medium text-[#0A4D8C]">
                  Submission Status: Under Review
                </p>
                <h3 className="text-base font-semibold text-[#1E2329]">
                  Your Project Submission is Currently Under Review
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Your completed spreadsheet link and screen recording video proof have been submitted to the admin queue. The review period lasts up to 2 hours.
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
            <div className="bg-emerald-50 border border-emerald-200 text-[#1E2329] rounded-xl p-6 text-center space-y-2.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 text-[#0D7A5F] flex items-center justify-center mx-auto">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="text-base font-semibold text-[#1E2329]">
                Project Submission Approved & Verified
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The administrator verified your Excel formulas and screen recording proof. Your earnings have been credited.
              </p>
            </div>
          )}

          {/* 10-Project Audit Loading Screen */}
          {isAnalyzing10Batch && (
            <div className="bg-white text-[#1E2329] rounded-xl p-6 text-center space-y-4 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center mx-auto">
                <Cpu size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#0A4D8C]">
                  Central Spreadsheet Audit In Progress
                </p>
                <h3 className="text-base font-semibold text-[#1E2329]">
                  Auditing All 10 Data Entry Projects
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto tabular-nums">
                  {analysisStepText} ({analysis10Progress}%)
                </p>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                <div 
                  className="bg-[#0A4D8C] h-full rounded-full transition-all duration-300"
                  style={{ width: `${analysis10Progress}%` }}
                />
              </div>

              <div className="text-xs text-[#5F4B16] flex items-center justify-center gap-1.5 bg-[#FEF7E0] py-2 px-4 rounded-lg border border-[#F3DFA2] max-w-xs mx-auto font-mono font-medium tabular-nums">
                <Clock size={13} className="text-[#B47B00]" />
                <span>
                  Remaining: {Math.floor(analysisRemainingSeconds / 60)}m {analysisRemainingSeconds % 60}s
                </span>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-3 text-[#1E2329]">
              <div className="text-center space-y-2">
                <div className="w-11 h-11 rounded-xl bg-white border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
                  <AlertTriangle size={22} />
                </div>
                <p className="text-xs font-semibold text-rose-700">
                  Missing Data & Error Detected · Incomplete
                </p>
                <h3 className="text-base font-semibold text-[#1E2329]">
                  Data Entry Audit Failed — Missing Data Found
                </h3>
                <p className="text-xs text-rose-800 max-w-lg mx-auto leading-relaxed">
                  {currentSubmission?.rejectionReason ||
                    `Missing Data & Formula Error in Project #${project.number}: আপনার এই জায়গায় মিসিং ডেটা এবং ভুল রয়েছে — অনুগ্রহ করে স্প্রেডশিট চেক করে পুনরায় জমা দিন।`}
                </p>
              </div>

              <div className="bg-white border border-rose-200/80 rounded-lg p-3 text-xs space-y-1.5 text-left">
                <div className="font-semibold text-rose-800 flex items-center justify-between">
                  <span>Location Flagged (ত্রুটির স্থান):</span>
                  <span className="font-mono text-[11px]">Project #{project.number}</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  • Sheet <strong className="font-mono">{project.expectedSheets[0] || 'Summary'}</strong>: Missing Data in{' '}
                  <strong className="font-mono">{project.columns[project.columns.length - 1] || 'Calculated Column'}</strong> (Rows #14–#38) & BDT 50 deduction parity mismatch.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: DOWNLOAD RAW DATASET BANNER + CLIENT INSPECTOR */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-semibold text-[#1E2329]">
                  1. Client Database & Raw Excel Dataset (.xlsx)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {project.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDataset}
                disabled={downloading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold text-xs transition cursor-pointer shrink-0 disabled:opacity-50 w-full sm:w-auto whitespace-nowrap"
              >
                {downloading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                <span>{downloading ? 'Generating File...' : 'Download Full Dataset (.xlsx)'}</span>
              </button>
            </div>

            {downloadMsg && (
              <p className="text-xs font-medium text-[#0A4D8C] flex items-center gap-1.5">
                <Info size={14} /> {downloadMsg}
              </p>
            )}

            {/* Client Records Preview */}
            {sampleClientRecords.length > 0 && (
              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowClientPreview(!showClientPreview)}
                  className="w-full flex items-center justify-between bg-[#F4F5F7] hover:bg-slate-200/70 px-3.5 py-2.5 rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2329]">
                    <Users size={15} className="text-[#0A4D8C]" />
                    <span>Inspect Client Records ({Object.keys(sampleClientRecords[0]).length} Fields / Client)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#0A4D8C]">
                    <Eye size={13} />
                    <span>{showClientPreview ? 'Hide Preview' : 'View Details'}</span>
                    {showClientPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>

                {showClientPreview && (
                  <div className="bg-[#22262C] text-white rounded-xl p-4 space-y-3 border border-slate-800">
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/10 pb-2.5">
                      <span className="text-xs font-medium text-blue-200 tabular-nums">
                        Sample Client #{previewIndex + 1} of {sampleClientRecords.length} (Full Dataset in .xlsx)
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {sampleClientRecords.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewIndex(idx)}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold cursor-pointer transition ${
                              previewIndex === idx
                                ? 'bg-[#0A4D8C] text-white'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                            }`}
                          >
                            #{idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                      {Object.entries(sampleClientRecords[previewIndex] || {}).map(([fieldKey, fieldVal]) => (
                        <div key={fieldKey} className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-2">
                          <span className="text-[11px] text-slate-400 block truncate">{fieldKey}</span>
                          <span className="text-xs font-mono font-medium text-white break-all tabular-nums">
                            {fieldVal === '' || fieldVal === undefined ? '[Calculate in Excel]' : String(fieldVal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: STEP-BY-STEP CALCULATION INSTRUCTIONS */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-semibold text-[#1E2329]">
                2. Required Calculation & Data Cleaning Instructions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Follow these exact mathematical operations and formula rules in your spreadsheet:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {project.tasks.map((task, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-[#F4F5F7] border border-slate-200/70 flex items-start gap-2.5 text-xs leading-relaxed text-[#1E2329]"
                >
                  <span className="font-mono font-semibold text-[#0A4D8C] shrink-0 tabular-nums">
                    {index + 1}.
                  </span>
                  <p>{task}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-[#EEF5FC] rounded-xl p-3.5 border border-[#D4E4F7] space-y-1.5">
                <span className="font-semibold text-[#0A4D8C] flex items-center gap-1.5">
                  <FileSpreadsheet size={14} /> Included Columns ({project.columns.length})
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {project.columns.join(' · ')}
                </p>
              </div>

              <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80 space-y-1.5">
                <span className="font-semibold text-[#0D7A5F] flex items-center gap-1.5">
                  <FileCheck size={14} /> Expected Output Worksheets
                </span>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                  {project.expectedSheets.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: SUBMIT COMPLETED WORK FORM */}
          {!isUnderReview && !isAccepted && (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-semibold text-[#1E2329]">
                  3. Submit Completed Project & Screen Recording Proof
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste your shared Google Sheets link and screen recording video link below:
                </p>
              </div>

              {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle size={15} className="shrink-0 text-rose-700" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Input 1 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#1E2329]">
                  Completed Excel Sheet / Google Sheets Share Link <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="url"
                    required={!excelFile}
                    placeholder="https://docs.google.com/spreadsheets/d/... ('Anyone with link can view')"
                    value={spreadsheetUrl}
                    onChange={(e) => setSpreadsheetUrl(e.target.value)}
                    className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 pl-9 text-xs text-[#1E2329] font-mono focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                  />
                  <Link2 size={14} className="absolute left-3 top-3 text-slate-400" />
                </div>

                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <label className="text-xs font-medium text-[#0A4D8C] hover:bg-blue-50 bg-[#EEF5FC] px-3 py-1.5 rounded-lg border border-[#D4E4F7] cursor-pointer flex items-center gap-1.5">
                    <Upload size={13} />
                    <span>Or Upload .xlsx File Directly</span>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                      className="hidden" 
                    />
                  </label>
                  {excelFile && (
                    <span className="text-xs text-[#0D7A5F] font-medium truncate max-w-xs">
                      Selected: {excelFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Input 2 */}
              {isVideoRequired && (
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-medium text-[#1E2329]">
                      Screen Recording Video Proof Link (Google Drive / Loom / Dropbox) <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-[#0A4D8C] shrink-0">
                      Mandatory Proof
                    </span>
                  </div>

                  <div className="relative">
                    <input 
                      type="url"
                      required={!videoFile}
                      placeholder="https://drive.google.com/file/d/... or https://www.loom.com/share/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg px-3.5 py-2.5 pl-9 text-xs text-[#1E2329] font-mono focus:outline-none focus:border-[#0A4D8C] focus:bg-white"
                    />
                    <Video size={14} className="absolute left-3 top-3 text-slate-400" />
                  </div>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <label className="text-xs font-medium text-[#1E2329] hover:bg-slate-200/70 bg-[#F4F5F7] px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer flex items-center gap-1.5">
                      <Upload size={13} />
                      <span>Or Upload Video File (MP4, WebM)</span>
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="hidden" 
                      />
                    </label>
                    {videoFile && (
                      <span className="text-xs text-[#0D7A5F] font-medium truncate max-w-xs">
                        Selected: {videoFile.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Input 3 */}
              <div className="space-y-1 pt-3 border-t border-slate-100">
                <label className="block text-xs font-medium text-[#1E2329]">
                  Work Process Notes & Formulas Used (Optional)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Mention formulas used (e.g. SUM, IF condition, VLOOKUP, BDT 50 deduction)..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-slate-200 rounded-lg p-3 text-xs text-[#1E2329] focus:outline-none focus:border-[#0A4D8C] focus:bg-white resize-none"
                />
              </div>

              {/* Final Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {submitting ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  <span>{submitting ? 'Submitting & Initiating Review...' : 'Submit Project for Admin Review'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  Submission will immediately start a 2-hour review window in the admin queue.
                </p>
              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#0A4D8C]" />
            <span>Project Ref: <strong className="font-mono text-[#1E2329]">{project.id}</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#1E2329] font-medium transition cursor-pointer whitespace-nowrap"
          >
            Close Workspace
          </button>
        </div>

      </div>
    </div>
  );
};
