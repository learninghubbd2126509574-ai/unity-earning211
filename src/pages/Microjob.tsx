import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Zap, ThumbsUp, Youtube, Facebook, ArrowUpRight } from 'lucide-react';
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
  
  // Upload state
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newNotice, setNewNotice] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'microjobs'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      let fetched: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      fetched = fetched.map(l => ({ ...l, reward: l.reward || 1 }));

      const demoLinks = Array.from({ length: 8 }).map((_, i) => ({
        id: `demo_${i}`,
        platform: i % 2 === 0 ? 'Facebook' : 'YouTube',
        url: '#',
        notice: 'Engage with this community link to claim instant points! (Verified Partner)',
        reward: 1
      }));

      setLinks([...fetched, ...demoLinks]);
    });
    return () => unsub();
  }, []);

  const handleLike = async (url: string, reward: number) => {
    if (!user) return;
    
    await updateDoc(doc(db, 'users', user.uid), {
      microjobPoints: increment(reward)
    });
    
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const handleUploadLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    if (profile.microjobPoints < 20) {
      alert("20 Microjob Points are required to post a link!");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Points Balance Banner */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white rounded-b-3xl shadow-sm">
        <h2 className="text-sm font-semibold opacity-90 border-b border-white/20 pb-2">
          Posting a personal link requires 20 Microjob Points
        </h2>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-4xl font-extrabold">{profile?.microjobPoints || 0}</span>
          <span className="text-xs uppercase font-bold tracking-wider opacity-90">Micro Points</span>
        </div>
        <div className="mt-4 flex gap-3">
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="bg-white text-orange-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-orange-50 transition-colors shadow-sm"
          >
            <ArrowUpRight size={16} /> Post Link Promotion (-20 pts)
          </button>
        </div>
      </div>

      <div className="p-4 pt-5">
        {/* Post Form */}
        {showUpload && (
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 mb-6 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Post a Promotion Link</h3>
            <form onSubmit={handleUploadLink} className="space-y-3">
              <select 
                value={newPlatform} 
                onChange={e => setNewPlatform(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="Facebook">Facebook Page / Post</option>
                <option value="YouTube">YouTube Channel / Video</option>
              </select>

              <input 
                required 
                type="url" 
                placeholder="Link URL (https://...)" 
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />

              <textarea 
                placeholder="Instructions for viewers (e.g. Please subscribe and like this video!)" 
                value={newNotice} 
                onChange={e => setNewNotice(e.target.value)} 
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" 
              />

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl py-3 text-xs transition shadow-md disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Promotion (Cost: 20 Points)'}
              </button>
            </form>
          </div>
        )}

        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
          <Zap size={16} className="text-amber-500" /> Available Engagement Tasks
        </h3>

        <div className="space-y-2.5 pb-6">
          {links.map(l => (
            <div key={l.id} className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${l.platform === 'Facebook' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                    {l.platform === 'Facebook' ? <Facebook size={18} /> : <Youtube size={18} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{l.platform} Engagement</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Click link and support this channel</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleLike(l.url, l.reward)}
                  className="bg-orange-50 text-orange-600 hover:bg-orange-100 active:scale-95 px-3 py-1.5 rounded-xl flex items-center gap-1 transition border border-orange-100 font-bold text-xs shadow-xs"
                >
                  <ThumbsUp size={12} /> +{l.reward} Pt
                </button>
              </div>
              
              {l.notice && (
                <div className="mt-2.5 text-[11px] bg-slate-50 text-slate-600 p-2 rounded-xl border border-slate-100 font-medium">
                  📢 {l.notice}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
