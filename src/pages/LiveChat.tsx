import React, { useState, useEffect, useRef } from 'react';
import { Send, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generate320RealisticChatPool, PresetMessage } from '../data/liveChatMessages';

interface ChatMessage {
  id: string;
  userName: string;
  district: string;
  text: string;
  timeString: string;
  isUser?: boolean;
  avatarColor: string;
}

const AVATAR_COLORS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-purple-600 to-violet-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-cyan-600 to-blue-700',
  'from-fuchsia-600 to-purple-700'
];

const ALL_320_MESSAGES = generate320RealisticChatPool();

export const LiveChat = () => {
  const { profile } = useAuth();

  // Active online student counter around 476 members
  const [onlineCount, setOnlineCount] = useState(476);

  // Input message
  const [inputText, setInputText] = useState('');

  // Queue and visible messages state
  const poolIndexRef = useRef(14);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial 14 messages
    return ALL_320_MESSAGES.slice(0, 14).map((m, idx) => ({
      id: `init-${idx}`,
      userName: m.userName,
      district: m.district,
      text: m.text,
      timeString: `${Math.max(1, 14 - idx)} মিনিট আগে`,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length]
    }));
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Online count slight realistic oscillation around 476 (472-488)
  useEffect(() => {
    const countInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(468, Math.min(489, prev + delta));
      });
    }, 15000);
    return () => clearInterval(countInterval);
  }, []);

  // Organic irregular message stream: variable 1s, 2s, 3.5s, 4s delays, sometimes rapid bursts
  useEffect(() => {
    let timeoutId: any = null;

    const scheduleNextMessage = () => {
      // Realistic variable delay: between 1200ms and 4000ms, occasionally 800ms quick burst
      const delays = [800, 1300, 1900, 2400, 3100, 3800, 4000];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      timeoutId = setTimeout(() => {
        const nextIdx = poolIndexRef.current % ALL_320_MESSAGES.length;
        const nextData = ALL_320_MESSAGES[nextIdx];
        poolIndexRef.current += 1;

        const newMsg: ChatMessage = {
          id: `stream-${Date.now()}-${nextIdx}`,
          userName: nextData.userName,
          district: nextData.district,
          text: nextData.text,
          timeString: 'এইমাত্র',
          avatarColor: AVATAR_COLORS[nextIdx % AVATAR_COLORS.length]
        };

        setMessages((prev) => {
          // Keep maximum latest 25 messages on screen for smooth 60fps rendering
          return [...prev.slice(-24), newMsg];
        });

        scheduleNextMessage();
      }, randomDelay);
    };

    scheduleNextMessage();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Handle user send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      userName: profile?.fullName || 'You (শিক্ষার্থী)',
      district: 'Student Account',
      text: cleanText,
      timeString: 'এইমাত্র',
      isUser: true,
      avatarColor: 'from-orange-500 to-amber-600'
    };

    setMessages((prev) => [...prev.slice(-24), userMsg]);
    setInputText('');
    setTimeout(scrollToBottom, 50);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] max-w-4xl mx-auto pb-4 px-2 sm:px-4">
      
      {/* Top Header - Clean and Minimal with Member Counter Only */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-4 shadow-md border border-slate-800 shrink-0 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Radio size={20} className="animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">
              লাইভ স্টুডেন্ট চ্যাটরুম
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span className="text-emerald-400 font-bold font-mono">{onlineCount} জন মেম্বার</span> সক্রিয় আছেন
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-2.5 p-3 sm:p-4 bg-slate-100/80 rounded-3xl border border-slate-200/90 shadow-inner relative hide-scrollbar"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-1 ${
              msg.isUser ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Circular Blank Silhouette Avatar */}
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${msg.avatarColor} text-white flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden relative`}>
              <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-900/40 fill-white p-0.5" title="Blank Student Avatar">
                <circle cx="50" cy="38" r="20" className="fill-white/80" />
                <path d="M16 95 C16 68, 30 58, 50 58 C70 58, 84 68, 84 95 Z" className="fill-white/80" />
              </svg>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3 shadow-xs space-y-1 relative ${
                msg.isUser
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-[11px] sm:text-xs leading-none ${msg.isUser ? 'text-white' : 'text-slate-900'}`}>
                    {msg.userName}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-semibold ${
                    msg.isUser
                      ? 'bg-black/20 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {msg.district}
                  </span>
                </div>

                <span className={`text-[9px] font-mono ${msg.isUser ? 'text-white/80' : 'text-slate-400'}`}>
                  {msg.timeString}
                </span>
              </div>

              {/* Message Content */}
              <p className={`text-xs sm:text-[13px] leading-relaxed font-sans ${msg.isUser ? 'text-white' : 'text-slate-700'}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="আপনার মেসেজ বা কাজের অভিজ্ঞতা লিখুন..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-sans"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
          title="Send message"
        >
          <Send size={15} />
        </button>
      </form>

    </div>
  );
};
