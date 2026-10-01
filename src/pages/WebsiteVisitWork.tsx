import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Globe, Timer, CheckCircle2, ExternalLink, Sparkles, Award } from 'lucide-react';
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
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={16} /> Partner Web Traffic Network
        </div>
        <h1 className="text-xl font-bold">Website Visit & Earn</h1>
        <p className="text-xs text-sky-100 mt-1 leading-relaxed">
          Browse verified partner content for the required duration to receive instant balance compensation.
        </p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-sky-500/50">
          <div>
            <div className="text-[10px] text-sky-200 uppercase font-bold">Websites Visited</div>
            <div className="text-lg font-mono font-bold">{visitedCount} Sites</div>
          </div>
          <div className="w-px h-8 bg-sky-500/50"></div>
          <div>
            <div className="text-[10px] text-sky-200 uppercase font-bold">Total Earned</div>
            <div className="text-lg font-mono font-bold text-amber-300">BDT {totalClaimed.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Main Target Site Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md uppercase">
              {activeSite.category}
            </span>
            <h3 className="text-base font-bold text-slate-800 mt-2">{activeSite.name}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeSite.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Reward</div>
            <div className="text-base font-bold text-emerald-600 font-mono">+BDT {activeSite.reward.toFixed(2)}</div>
          </div>
        </div>

        {/* Website Preview Box */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 font-mono text-xs border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-sky-400" />
              <span>{activeSite.url}</span>
            </div>
            <span className="text-emerald-400 text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
              SSL Verified
            </span>
          </div>

          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mx-auto">
              <Globe size={20} />
            </div>
            <div className="font-sans font-bold text-sm text-slate-200">{activeSite.name}</div>
            <p className="text-[11px] text-slate-400 font-sans max-w-xs mx-auto">
              Active verification session will stream site telemetry for engagement auditing.
            </p>
          </div>
        </div>

        {/* Controls */}
        {!isBrowsing && !completed && (
          <button
            onClick={handleStartBrowsing}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-md text-xs flex items-center justify-center gap-2"
          >
            <Globe size={16} /> Start 15-Second Browsing Session
          </button>
        )}

        {isBrowsing && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-semibold">
              <Timer size={16} className="text-sky-600 animate-spin" />
              <span>Browsing partner site in active viewport...</span>
            </div>
            
            <div className="text-3xl font-mono font-extrabold text-sky-600">
              00:{secondsLeft.toString().padStart(2, '0')}
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((15 - secondsLeft) / 15) * 100}%` }}
              />
            </div>
          </div>
        )}

        {completed && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="text-sm font-bold text-emerald-800">Visit Verified!</h4>
            <p className="text-xs text-emerald-700">
              You have completed the required duration. Claim your reward below.
            </p>
            <button
              onClick={handleClaimReward}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <Award size={16} /> Claim BDT {activeSite.reward.toFixed(2)} Credit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
