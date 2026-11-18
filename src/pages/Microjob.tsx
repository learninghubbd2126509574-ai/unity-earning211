import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Zap, ThumbsUp, Youtube, Facebook, ArrowUpRight, AlertCircle, Info } from 'lucide-react';
import { ModuleGuard } from '../components/ModuleGuard';

export const Microjob = () => {
  return (
    <ModuleGuard moduleId="micro" title="Micro Job Work">
      <MicroApp />
    </ModuleGuard>
  );
};

const MicroApp = () => {
  const { user, profile } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Upload state
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newNotice, setNewNotice] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'microjobs'), where('isActive', '==', true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        let fetched: any[] = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        fetched = fetched.map(l => ({ ...l, reward: l.reward || 1 }));

        const demoLinks = Array.from({ length: 8 }).map((_, i) => ({
          id: `demo_${i}`,
          platform: i % 2 === 0 ? 'Facebook' : 'YouTube',
          url: '#',
          notice: 'Engage with this community link to claim instant points (Verified Partner).',
          reward: 1
        }));

        setLinks([...fetched, ...demoLinks]);
      },
      (err) => {
        console.warn('Microjob listener warning:', err);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const handleLike = async (url: string, reward: number) => {
    if (!user) return;
    
    await updateDoc(doc(db, 'users', user.uid), {
      microjobPoints: increment(reward)
    });
    
    if (url && url !== '#') {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    }
  };

  const handleUploadLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setUploadError(null);

    if (profile.microjobPoints < 20) {
      setUploadError('20 Microjob Points are required to post a promotional link.');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        microjobPoints: increment(-20)
      });

      await addDoc(collection(db, 'microjobs'), {
        userId: user.uid,
        platform: newPlatform,
        url: newUrl,
        notice: newNotice,
        isActive: true,
        reward: 1,
        createdAt: new Date().toISOString()
      });

      setNewUrl('');
      setNewNotice('');
      setShowUpload(false);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to publish promotional link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F4F5F7] pb-24">
      <div className="p-4 max-w-2xl mx-auto w-full space-y-4">
        {/* Points Balance Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/15">
            <span className="text-[11px] font-medium text-white/85">
              Personal Promotion Posting Requirement
            </span>
            <span className="text-[11px] font-mono tabular-nums font-medium text-white/85">
              20 Pts / Post
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 mt-3.5">
            <div>
              <div className="text-[11px] font-medium text-white/75">Available Micro Points</div>
              <div className="text-3xl font-semibold font-mono tabular-nums tracking-tight mt-0.5">
                {profile?.microjobPoints || 0} <span className="text-sm font-medium text-white/80">Pts</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowUpload(!showUpload);
                setUploadError(null);
              }}
              className="bg-white text-[#0A4D8C] hover:bg-[#EEF5FC] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowUpRight size={15} />
              <span>{showUpload ? 'Close Form' : 'Post Promotion'}</span>
            </button>
          </div>
        </div>

        {/* Post Form */}
        {showUpload && (
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-semibold text-[#111827] text-sm">Post a Promotion Link</h3>
              <span className="text-[11px] font-mono tabular-nums font-medium text-[#0A4D8C]">Cost: 20 Pts</span>
            </div>

            {uploadError && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] rounded-lg text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadLink} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Platform</label>
                <select 
                  value={newPlatform} 
                  onChange={e => setNewPlatform(e.target.value)} 
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C]"
                >
                  <option value="Facebook">Facebook Page / Post</option>
                  <option value="YouTube">YouTube Channel / Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target URL *</label>
                <input 
                  required 
                  type="url" 
                  placeholder="https://..." 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)} 
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0A4D8C]" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Instructions for Members</label>
                <textarea 
                  placeholder="e.g. Please subscribe and engage with this video." 
                  value={newNotice} 
                  onChange={e => setNewNotice(e.target.value)} 
                  rows={2}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] resize-none" 
                />
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold rounded-lg py-2.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Publishing...' : 'Publish Promotion (20 Points)'}
              </button>
            </form>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="font-semibold text-[#111827] flex items-center gap-2 text-sm">
            <Zap size={16} className="text-[#0A4D8C]" />
            <span>Available Engagement Tasks</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono tabular-nums">{links.length} Tasks</span>
        </div>

        {/* Tasks List */}
        <div className="space-y-2.5">
          {links.map(l => (
            <div key={l.id} className="bg-white p-4 rounded-xl border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    l.platform === 'Facebook'
                      ? 'bg-[#EEF5FC] border-[#D4E4F7] text-[#0A4D8C]'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    {l.platform === 'Facebook' ? <Facebook size={17} /> : <Youtube size={17} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#111827] truncate">{l.platform} Engagement</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">Open link and complete interaction</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleLike(l.url, l.reward)}
                  className="bg-[#EEF5FC] text-[#0A4D8C] hover:bg-[#DCEBFA] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-[#D4E4F7] font-semibold font-mono tabular-nums text-xs whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ThumbsUp size={13} /> +{l.reward} Pt
                </button>
              </div>
              
              {l.notice && (
                <div className="text-[11px] bg-[#EEF5FC] text-slate-700 px-3 py-2 rounded-lg border border-[#D4E4F7] flex items-start gap-2">
                  <Info size={13} className="text-[#0A4D8C] shrink-0 mt-0.5" />
                  <span className="leading-snug">{l.notice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

