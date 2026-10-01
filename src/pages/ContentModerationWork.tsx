import React, { useState } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { CheckSquare, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Sparkles, Trophy } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const MODERATION_ITEMS = [
  {
    id: 'mod_1',
    userHandle: '@cryptoguru_99',
    timestamp: '5 minutes ago',
    type: 'Comment Submission',
    content: 'Guaranteed 500% profit in 24 hours! Send your wallet keys to telegram @quick_doubler_vip for instant payout!',
    expectedVerdict: 'violation',
    reason: 'Cryptocurrency scam / phishing attempt'
  },
  {
    id: 'mod_2',
    userHandle: '@nature_lover_bd',
    timestamp: '12 minutes ago',
    type: 'Forum Discussion',
    content: 'I recently visited Sreemangal tea gardens and the morning weather was truly mesmerizing. Highly recommend the eco cottages!',
    expectedVerdict: 'safe',
    reason: 'Organic, safe community travel feedback'
  },
  {
    id: 'mod_3',
    userHandle: '@digital_hustle',
    timestamp: '25 minutes ago',
    type: 'Group Post',
    content: 'Free software crack available! Download clean zip with disabled antivirus at malicious-site-domain.xyz/download',
    expectedVerdict: 'violation',
    reason: 'Malware distribution / malicious links'
  },
  {
    id: 'mod_4',
    userHandle: '@frontend_dev_pro',
    timestamp: '40 minutes ago',
    type: 'Q&A Submission',
    content: 'What is the optimal way to manage server-side tokens in Next.js without leaking client environment variables?',
    expectedVerdict: 'safe',
    reason: 'Legitimate programming inquiry'
  }
];

export const ContentModerationWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="moderation" title="Content Moderation Work">
      <ContentModerationApp />
    </ModuleGuard>
  );
};

const ContentModerationApp: React.FC = () => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentItem = MODERATION_ITEMS[currentIndex % MODERATION_ITEMS.length];

  const handleDecision = async (decision: 'safe' | 'violation') => {
    if (isProcessing || feedback) return;
    setIsProcessing(true);

    const isCorrect = decision === currentItem.expectedVerdict;

    if (isCorrect) {
      setFeedback({
        message: `Correct decision! Item correctly identified as ${decision.toUpperCase()}. +BDT 0.20 credited.`,
        isCorrect: true
      });
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(0.20)
          });
          setTotalEarned(prev => prev + 0.20);
        } catch (err) {
          console.error(err);
        }
      }
      setReviewedCount(prev => prev + 1);
    } else {
      setFeedback({
        message: `Incorrect evaluation. Note: ${currentItem.reason}`,
        isCorrect: false
      });
    }

    setIsProcessing(false);
  };

  const handleNext = () => {
    setFeedback(null);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={16} /> Community Safety Operations
          </div>
          <h1 className="text-xl font-bold">Content Moderation Work</h1>
          <p className="text-xs text-cyan-100 mt-1 leading-relaxed max-w-sm">
            Review user-generated submissions against community standards. Accurately approve safe items or flag policy violations.
          </p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cyan-500/50">
            <div>
              <div className="text-[10px] text-cyan-200 uppercase font-bold">Reviewed Today</div>
              <div className="text-lg font-mono font-bold">{reviewedCount} Items</div>
            </div>
            <div className="w-px h-8 bg-cyan-500/50"></div>
            <div>
              <div className="text-[10px] text-cyan-200 uppercase font-bold">Earned Balance</div>
              <div className="text-lg font-mono font-bold text-amber-300">BDT {totalEarned.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Review Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-800">{currentItem.userHandle}</span>
            <span className="text-[10px] text-slate-400 ml-2">{currentItem.timestamp}</span>
          </div>
          <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md uppercase">
            {currentItem.type}
          </span>
        </div>

        {/* Content Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed min-h-[100px] flex items-center">
          "{currentItem.content}"
        </div>

        {/* Action Decision Buttons */}
        {!feedback ? (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 text-center">
              Evaluate this content submission:
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDecision('safe')}
                disabled={isProcessing}
                className="py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <CheckCircle2 size={18} /> Mark as Safe
              </button>
              <button
                onClick={() => handleDecision('violation')}
                disabled={isProcessing}
                className="py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <XCircle size={18} /> Flag Violation
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-2xl border text-center space-y-3 ${
            feedback.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="text-sm font-bold">{feedback.message}</div>
            <button
              onClick={handleNext}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition shadow-sm text-xs"
            >
              Continue to Next Item
            </button>
          </div>
        )}
      </div>

      {/* Guidelines Box */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 mb-1">Standard Moderation Criteria:</div>
        <div>• Flag unsolicited promotional spam, phishing links, and deceptive offers.</div>
        <div>• Flag abusive language, harassment, or malicious code distribution.</div>
        <div>• Approve constructive feedback, questions, and polite interactions.</div>
      </div>
    </div>
  );
};
