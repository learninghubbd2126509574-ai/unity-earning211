import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  addDoc
} from 'firebase/firestore';

export interface ProjectSubmissionDoc {
  id?: string;
  projectId: string;
  projectNumber: number;
  projectTitle: string;
  userId: string;
  participantName: string;
  participantPhone: string;
  participantEmail?: string;
  studentIdCode?: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  submissionTime?: string;
  reviewDeadline?: string; // ISO string 120 minutes from submission
  videoSubmitted: boolean;
  videoUrl?: string;
  videoFileName?: string;
  excelFileName?: string;
  notes?: string;
  acceptanceTime?: string;
  rejectionTime?: string;
  rejectionReason?: string;
  reviewerId?: string;
  autoRejected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const REVIEW_TIMEOUT_MINUTES = 120; // 2 Hours Review Window

/**
 * Checks if a submission has passed its review deadline and automatically flags missing data / rejects it.
 */
export async function checkAndApplyAutoRejection(submission: ProjectSubmissionDoc): Promise<ProjectSubmissionDoc> {
  if (submission.status === 'Under Review' && submission.reviewDeadline && submission.id) {
    const deadlineTime = new Date(submission.reviewDeadline).getTime();
    const now = Date.now();
    
    if (now >= deadlineTime) {
      const rejectionTime = new Date().toISOString();
      const updatedData = {
        status: 'Rejected' as const,
        rejectionTime,
        autoRejected: true,
        rejectionReason: `Missing Data & Formula Error in Project #${submission.projectNumber}: আপনার এই জায়গায় মিসিং ডেটা রয়েছে (Row #14–#38 Net Payable / BDT 50 Deduction Cell Missing)।`,
        updatedAt: rejectionTime
      };

      try {
        await updateDoc(doc(db, 'projectSubmissions', submission.id), updatedData);
        return {
          ...submission,
          ...updatedData
        };
      } catch (err) {
        console.error('Failed to update auto rejection in Firestore:', err);
      }
    }
  }
  return submission;
}

/**
 * Submits a completed project, starting the exact 60-minute review timer.
 */
export async function submitDataEntryProject(params: {
  projectId: string;
  projectNumber: number;
  projectTitle: string;
  userId: string;
  participantName: string;
  participantPhone: string;
  participantEmail?: string;
  studentIdCode?: string;
  excelFileName: string;
  videoUrl?: string;
  videoFileName?: string;
  notes?: string;
}): Promise<string> {
  const now = new Date();
  const submissionTime = now.toISOString();
  
  // 60-Minute Review Timer
  const deadline = new Date(now.getTime() + REVIEW_TIMEOUT_MINUTES * 60 * 1000);
  const reviewDeadline = deadline.toISOString();

  const submissionPayload: Omit<ProjectSubmissionDoc, 'id'> = {
    projectId: params.projectId,
    projectNumber: params.projectNumber,
    projectTitle: params.projectTitle,
    userId: params.userId,
    participantName: params.participantName,
    participantPhone: params.participantPhone,
    participantEmail: params.participantEmail || '',
    studentIdCode: params.studentIdCode || '',
    status: 'Under Review', // Directly Under Review upon submission
    submissionTime,
    reviewDeadline,
    videoSubmitted: Boolean(params.videoUrl || params.videoFileName),
    videoUrl: params.videoUrl || '',
    videoFileName: params.videoFileName || '',
    excelFileName: params.excelFileName,
    notes: params.notes || '',
    createdAt: submissionTime,
    updatedAt: submissionTime
  };

  const docRef = await addDoc(collection(db, 'projectSubmissions'), submissionPayload);
  return docRef.id;
}
