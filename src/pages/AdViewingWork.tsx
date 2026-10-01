import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Eye, CheckCircle2, AlertCircle, ExternalLink, Timer, Sparkles, Trophy } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const SPONSORED_ADS = [
  {
    id: 'ad_1',
    sponsor: 'TechVanguard Cloud Solutions',
    headline: 'High-Performance Cloud Infrastructure for Modern Enterprises',
    tagline: 'Scale faster with 99.99% SLA uptime and intelligent automated resource allocation.',
    category: 'Cloud Computing & AI',
    website: 'https://example.com/techvanguard',
    duration: 10,
    reward: 0.50,
    bannerColor: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'ad_2',
    sponsor: 'FinPulse Smart Analytics',
    headline: 'Next-Generation Real-Time Automated Portfolio Management',
    tagline: 'Make data-driven financial decisions with bank-grade encryption and predictive insights.',
    category: 'Fintech & Security',
    website: 'https://example.com/finpulse',
    duration: 10,
    reward: 0.50,
    bannerColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'ad_3',
    sponsor: 'Apex Digital Marketing Pro',
    headline: 'Accelerate Customer Acquisition with Targeted Omnichannel Campaigns',
    tagline: 'Reach qualified business prospects with programmatic precision and automated analytics.',
    category: 'Growth & Marketing',
    website: 'https://example.com/apex-growth',
    duration: 10,
    reward: 0.50,
    bannerColor: 'from-orange-500 to-rose-600'
  },
  {
    id: 'ad_4',
    sponsor: 'CyberShield Zero-Trust',
    headline: 'Defend Enterprise Endpoints with Autonomous Threat Detection',
    tagline: 'Eliminate vulnerabilities before they compromise critical operational infrastructure.',
    category: 'Cybersecurity',
    website: 'https://example.com/cybershield',
    duration: 10,
    reward: 0.50,
    bannerColor: 'from-purple-600 to-slate-900'
  }
];

export const AdViewingWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="ad_viewing" title="Sponsored Ad Viewing">
      <AdViewingApp />
    </ModuleGuard>
  );
};

const AdViewingApp: React.FC = () => {
  const { user } = useAuth();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isViewing, setIsViewing] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeAd = SPONSORED_ADS[currentAdIndex % SPONSORED_ADS.length];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isViewing && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isViewing && secondsRemaining === 0) {
      setIsViewing(false);
      setIsCompleted(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isViewing, secondsRemaining]);

  const startAdSession = () => {
    setIsViewing(true);
    setSecondsRemaining(activeAd.duration);
    setIsCompleted(false);
  };

  const handleClaimReward = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(activeAd.reward)
      });
      setCompletedCount(prev => prev + 1);
      setTotalEarned(prev => prev + activeAd.reward);
      setIsCompleted(false);
      setCurrentAdIndex(prev => prev + 1);
      setSecondsRemaining(10);
    } catch (err) {
      console.error("Failed to claim reward:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={16} /> Partner Campaign Network
          </div>
          <h1 className="text-xl font-bold">Sponsored Ad Viewing</h1>
          <p className="text-xs text-teal-100 mt-1 leading-relaxed max-w-sm">
            Watch verified partner sponsor promotions for the required duration to receive guaranteed balance credits.
          </p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-teal-500/50">
            <div>
              <div className="text-[10px] text-teal-200 uppercase font-bold">Completed Today</div>
              <div className="text-lg font-mono font-bold">{completedCount} Ads</div>
            </div>
            <div className="w-px h-8 bg-teal-500/50"></div>
            <div>
              <div className="text-[10px] text-teal-200 uppercase font-bold">Earnings Claimed</div>
              <div className="text-lg font-mono font-bold text-amber-300">BDT {totalEarned.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ad Stage */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {activeAd.category}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-2">{activeAd.sponsor}</h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Reward</div>
            <div className="text-base font-bold text-emerald-600">+BDT {activeAd.reward.toFixed(2)}</div>
          </div>
        </div>

        {/* Sponsor Banner Mockup */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${activeAd.bannerColor} text-white shadow-md relative overflow-hidden transition-all duration-300 min-h-[160px] flex flex-col justify-between`}>
          <div className="relative z-10">
            <h4 className="text-lg font-extrabold leading-snug">{activeAd.headline}</h4>
            <p className="text-xs text-white/80 mt-2 line-clamp-3 leading-relaxed">
              {activeAd.tagline}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-xs">
            <span className="text-white/70 font-mono text-[11px] flex items-center gap-1">
              <ExternalLink size={12} /> {activeAd.website}
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">
              Verified Sponsor
            </span>
          </div>
        </div>

        {/* Viewing Controls & Timer */}
        {!isViewing && !isCompleted && (
          <button
            onClick={startAdSession}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition shadow-md flex items-center justify-center gap-2"
          >
            <Eye size={18} /> Start 10-Second Ad View
          </button>
        )}

        {isViewing && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-semibold">
              <Timer size={16} className="text-teal-600 animate-spin" />
              <span>Verifying active viewport view...</span>
            </div>
            
            <div className="text-3xl font-mono font-extrabold text-teal-600">
              00:{secondsRemaining.toString().padStart(2, '0')}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-500 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((10 - secondsRemaining) / 10) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Please keep this screen open until the verification timer reaches zero.
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="text-base font-bold text-emerald-800">Ad Verification Complete!</h4>
            <p className="text-xs text-emerald-700">
              You have completed viewing this sponsored promotion. Claim your reward below.
            </p>
            <button
              onClick={handleClaimReward}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trophy size={16} /> {isProcessing ? 'Crediting Account...' : `Claim BDT ${activeAd.reward.toFixed(2)} Reward`}
            </button>
          </div>
        )}
      </div>

      {/* Rules Notice */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 mb-1">Ad Viewing Guidelines:</div>
        <div>• Each ad must be actively viewed for the full 10-second countdown.</div>
        <div>• Automated scripts or bots are detected and will result in task deactivation.</div>
        <div>• Balance is credited immediately upon clicking the claim reward button.</div>
      </div>
    </div>
  );
};
