import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Eye, CheckCircle2, ExternalLink, Timer, Trophy, ShieldCheck } from 'lucide-react';
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
    accentColor: 'bg-[#0A4D8C]'
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
    accentColor: 'bg-[#22262C]'
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
    accentColor: 'bg-[#0A4D8C]'
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
    accentColor: 'bg-[#22262C]'
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
    <div className="min-h-full bg-[#F4F5F7] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-medium mb-1">
            <ShieldCheck size={14} />
            <span>Partner Campaign Network</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Sponsored Ad Viewing</h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Watch verified partner sponsor promotions for the required duration to receive guaranteed balance credits.
          </p>

          <div className="flex items-center gap-6 mt-4 pt-3.5 border-t border-white/15">
            <div>
              <div className="text-[11px] text-white/75 font-medium">Completed Today</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">{completedCount} Ads</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="text-[11px] text-white/75 font-medium">Earnings Claimed</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">BDT {totalEarned.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Main Ad Stage */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-[11px] font-medium text-[#0A4D8C]">
                {activeAd.category}
              </span>
              <h3 className="text-base font-semibold text-[#111827] mt-0.5">{activeAd.sponsor}</h3>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[11px] text-slate-500 font-medium">Reward</div>
              <div className="text-sm font-semibold font-mono tabular-nums text-[#0D7A5F]">
                +BDT {activeAd.reward.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Sponsor Display Panel */}
          <div className={`p-5 rounded-xl ${activeAd.accentColor} text-white min-h-[150px] flex flex-col justify-between`}>
            <div>
              <h4 className="text-base font-semibold leading-snug">{activeAd.headline}</h4>
              <p className="text-xs text-white/80 mt-2 line-clamp-3 leading-relaxed">
                {activeAd.tagline}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
              <span className="text-white/75 font-mono text-[11px] flex items-center gap-1.5 truncate">
                <ExternalLink size={12} className="shrink-0" />
                <span className="truncate">{activeAd.website}</span>
              </span>
              <span className="text-[11px] font-medium text-white/90 whitespace-nowrap shrink-0">
                Verified Sponsor
              </span>
            </div>
          </div>

          {/* Viewing Controls & Timer */}
          {!isViewing && !isCompleted && (
            <button
              onClick={startAdSession}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={16} />
              <span>Start 10-Second Ad View</span>
            </button>
          )}

          {isViewing && (
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-medium">
                <Timer size={15} className="text-[#0A4D8C]" />
                <span>Verifying active viewport view...</span>
              </div>
              
              <div className="text-3xl font-mono tabular-nums font-semibold text-[#0A4D8C]">
                00:{secondsRemaining.toString().padStart(2, '0')}
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0A4D8C] h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${((10 - secondsRemaining) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Keep this screen open until the verification timer reaches zero.
              </p>
            </div>
          )}

          {isCompleted && (
            <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-center space-y-3">
              <div className="w-11 h-11 bg-white border border-[#A7F3D0] text-[#0D7A5F] rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-sm font-semibold text-[#065F46]">Ad Verification Complete</h4>
              <p className="text-xs text-[#047857]">
                You have completed viewing this sponsored promotion. Claim your balance credit below.
              </p>
              <button
                onClick={handleClaimReward}
                disabled={isProcessing}
                className="w-full bg-[#0D7A5F] hover:bg-[#09604A] text-white font-semibold py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Trophy size={15} />
                <span>{isProcessing ? 'Crediting Account...' : `Claim BDT ${activeAd.reward.toFixed(2)} Reward`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Guidelines Notice */}
        <div className="p-4 bg-[#FEF7E0] rounded-xl border border-[#F3DFA2] text-xs text-[#5F4B16] space-y-1.5">
          <div className="font-semibold text-[#47380F]">Ad Viewing Guidelines</div>
          <div>1. Each ad must be actively viewed for the full 10-second countdown.</div>
          <div>2. Automated scripts or bots are detected and result in task deactivation.</div>
          <div>3. Balance is credited immediately upon clicking Claim Reward.</div>
        </div>
      </div>
    </div>
  );
};

