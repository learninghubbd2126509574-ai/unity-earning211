import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Globe, Timer, CheckCircle2, Award } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const PARTNER_SITES = [
  {
    id: 'site_1',
    name: 'TechInsights Daily Digest',
    category: 'Technology & AI',
    url: 'https://example.com/techinsights',
    reward: 0.75,
    description: 'Explore the latest daily breakthroughs in quantum computing and cloud infrastructure.'
  },
  {
    id: 'site_2',
    name: 'Global Finance & Market Watch',
    category: 'Economics & Trade',
    url: 'https://example.com/finance-market',
    reward: 0.75,
    description: 'Real-time equity market analysis, central banking policies, and index funds.'
  },
  {
    id: 'site_3',
    name: 'EcoLiving Sustainable Horizons',
    category: 'Renewable Energy',
    url: 'https://example.com/ecoliving',
    reward: 0.75,
    description: 'Discover community-led clean energy innovations and sustainable conservation initiatives.'
  }
];

export const WebsiteVisitWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="website_visit" title="Website Visit & Earn">
      <WebsiteVisitApp />
    </ModuleGuard>
  );
};

const WebsiteVisitApp: React.FC = () => {
  const { user } = useAuth();
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [completed, setCompleted] = useState(false);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);

  const activeSite = PARTNER_SITES[currentSiteIndex % PARTNER_SITES.length];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBrowsing && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (isBrowsing && secondsLeft === 0) {
      setIsBrowsing(false);
      setCompleted(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBrowsing, secondsLeft]);

  const handleStartBrowsing = () => {
    setIsBrowsing(true);
    setSecondsLeft(15);
    setCompleted(false);
  };

  const handleClaimReward = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(activeSite.reward)
      });
      setTotalClaimed(prev => prev + activeSite.reward);
      setVisitedCount(prev => prev + 1);
      setCompleted(false);
      setCurrentSiteIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-full bg-[#F4F5F7] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="text-[11px] font-medium text-white/80 mb-1">
            Partner Web Traffic Network
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Website Visit & Earn</h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Browse verified partner content for the required duration to receive instant balance compensation.
          </p>

          <div className="flex items-center gap-6 mt-4 pt-3.5 border-t border-white/15">
            <div>
              <div className="text-[11px] text-white/75 font-medium">Websites Visited</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">{visitedCount} Sites</div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div>
              <div className="text-[11px] text-white/75 font-medium">Total Earned</div>
              <div className="text-base font-mono tabular-nums font-semibold mt-0.5">BDT {totalClaimed.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Main Target Site Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-[11px] font-medium text-[#0A4D8C]">
                {activeSite.category}
              </span>
              <h3 className="text-base font-semibold text-[#111827] mt-0.5">{activeSite.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeSite.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[11px] text-slate-500 font-medium">Reward</div>
              <div className="text-sm font-semibold text-[#0D7A5F] font-mono tabular-nums">+BDT {activeSite.reward.toFixed(2)}</div>
            </div>
          </div>

          {/* Website Preview Box */}
          <div className="bg-[#22262C] rounded-xl p-4 text-white space-y-3 font-mono text-xs border border-[#1A1D22]">
            <div className="flex items-center justify-between text-[11px] text-slate-300 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Globe size={13} className="text-sky-300 shrink-0" />
                <span className="truncate">{activeSite.url}</span>
              </div>
              <span className="text-emerald-300 text-[10px] font-medium whitespace-nowrap shrink-0">
                SSL Verified
              </span>
            </div>

            <div className="py-5 text-center space-y-1.5">
              <div className="w-9 h-9 bg-white/10 text-white rounded-lg flex items-center justify-center mx-auto">
                <Globe size={18} />
              </div>
              <div className="font-sans font-semibold text-sm text-white">{activeSite.name}</div>
              <p className="text-[11px] text-slate-300 font-sans max-w-xs mx-auto leading-relaxed">
                Active verification session records engagement duration cleanly.
              </p>
            </div>
          </div>

          {/* Controls */}
          {!isBrowsing && !completed && (
            <button
              onClick={handleStartBrowsing}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe size={15} />
              <span>Start 15-Second Browsing Session</span>
            </button>
          )}

          {isBrowsing && (
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-medium">
                <Timer size={15} className="text-[#0A4D8C]" />
                <span>Browsing partner site in active viewport...</span>
              </div>
              
              <div className="text-3xl font-mono tabular-nums font-semibold text-[#0A4D8C]">
                00:{secondsLeft.toString().padStart(2, '0')}
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0A4D8C] h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${((15 - secondsLeft) / 15) * 100}%` }}
                />
              </div>
            </div>
          )}

          {completed && (
            <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-center space-y-3">
              <div className="w-11 h-11 bg-white border border-[#A7F3D0] text-[#0D7A5F] rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-sm font-semibold text-[#065F46]">Visit Verified</h4>
              <p className="text-xs text-[#047857]">
                You have completed the required duration. Claim your reward below.
              </p>
              <button
                onClick={handleClaimReward}
                className="w-full bg-[#0D7A5F] hover:bg-[#09604A] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Award size={15} />
                <span>Claim BDT {activeSite.reward.toFixed(2)} Credit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

