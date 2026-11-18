import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generate500RealisticChatPool } from '../data/liveChatMessages';

interface ChatMessage {
  id: string;
  userName: string;
  district: string;
  text: string;
  timeString: string;
  isUser?: boolean;
}

const ALL_CHAT_MESSAGES = generate500RealisticChatPool();

const AVATAR_COLOR_PALETTE = [
  'bg-[#0A4D8C] text-white border-[#0A4D8C]',         // Blue
  'bg-white text-[#1E2329] border-slate-300',         // White
  'bg-[#FACC15] text-[#1E2329] border-[#EAB308]',     // Yellow
  'bg-[#1E2329] text-white border-[#1E2329]',         // Black
  'bg-[#0D7A5F] text-white border-[#0D7A5F]',         // Deep Teal
  'bg-[#1D4ED8] text-white border-[#1D4ED8]',         // Royal Blue
  'bg-[#EAB308] text-white border-[#CA8A04]',         // Gold Amber
  'bg-[#334155] text-white border-[#334155]'          // Slate Charcoal
];

function getAvatarColorClass(userName: string): string {
  let hash = 0;
  for (let i = 0; i < userName.length; i++) {
    hash = (hash * 31 + userName.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLOR_PALETTE[hash % AVATAR_COLOR_PALETTE.length];
}

function getContextualPeerReply(userText: string): { userName: string; district: string; text: string } | null {
  const lower = userText.toLowerCase();

  if (lower.includes('moderator') || lower.includes('মডারেটর') || lower.includes('apply') || lower.includes('এপ্লাই')) {
    return {
      userName: 'Sabbir Ahmed',
      district: 'Dhaka',
      text: 'ভাই Moderator আবেদন রিভিউ হতে সাধারণত ৩ থেকে ৭ কর্মদিবস সময় লাগে। আপনার আগের কাজের রেকর্ড ঠিক থাকলে টিম থেকে আপডেট পেয়ে যাবেন।'
    };
  }
  if (lower.includes('lead') || lower.includes('লিড') || lower.includes('convert') || lower.includes('কনভার্ট')) {
    return {
      userName: 'Farhana Akter',
      district: 'Chattogram',
      text: 'লিড জেনারেশনে শুধু লিংক শেয়ার না করে বাংলায় কাজের নিয়মটা ২-৩ লাইনে বুঝিয়ে বললে কনভার্ট রেট অনেক ভালো আসে ভাই, আলহামদুলিল্লাহ আমার ডেইলি ৩-৪ টা হচ্ছে।'
    };
  }
  if (lower.includes('typing') || lower.includes('টাইপিং') || lower.includes('start') || lower.includes('স্টার্ট') || lower.includes('cooldown') || lower.includes('লক')) {
    return {
      userName: 'Tanvir Hasan',
      district: 'Sylhet',
      text: 'টাইপিং কাজ করার আগে Start বাটনে ক্লিক করে ৩০ মিনিটের টাইমার অন করতে হয় ভাই, আর মাঝপথে পেজ রিফ্রেশ দিলে ২ ঘণ্টার কুলডাউন লক পড়ে যায়।'
    };
  }
  if (lower.includes('submit') || lower.includes('সাবমিট') || lower.includes('approve') || lower.includes('অ্যাপ্রুভ') || lower.includes('problem') || lower.includes('সমস্যা')) {
    return {
      userName: 'Mehedi Hasan Shuvo',
      district: 'Rajshahi',
      text: 'ভাই সাবমিট বা অ্যাপ্রুভ না হলে দেখেন সব বাধ্যতামূলক ঘর সঠিকভাবে পূরণ করেছেন কি না এবং Google Sheet / Drive লিংক "Anyone with the link" করা আছে কি না।'
    };
  }
  return null;
}

export const LiveChat = () => {
  const { profile } = useAuth();

  // Active online student counter
  const [onlineCount, setOnlineCount] = useState(() => Math.floor(Math.random() * (126 - 82 + 1)) + 82);
  const [inputText, setInputText] = useState('');

  const poolIndexRef = useRef(18);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return ALL_CHAT_MESSAGES.slice(0, 18).map((m, idx) => ({
      id: `init-${idx}`,
      userName: m.userName,
      district: m.district,
      text: m.text,
      timeString: `${Math.max(1, 18 - idx)} মিনিট আগে`
    }));
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const countInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 11) - 5;
        return Math.max(54, Math.min(148, prev + delta));
      });
    }, 9000);
    return () => clearInterval(countInterval);
  }, []);

  useEffect(() => {
    let timeoutId: any = null;
    let burstTimeoutId: any = null;

    const scheduleNextMessage = () => {
      const delays = [4500, 6000, 7500, 9000, 11000, 13500];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      timeoutId = setTimeout(() => {
        const nextIdx = poolIndexRef.current % ALL_CHAT_MESSAGES.length;
        const nextData = ALL_CHAT_MESSAGES[nextIdx];
        poolIndexRef.current += 1;

        const newMsg: ChatMessage = {
          id: `stream-${Date.now()}-${nextIdx}`,
          userName: nextData.userName,
          district: nextData.district,
          text: nextData.text,
          timeString: 'এইমাত্র'
        };

        setMessages((prev) => [...prev.slice(-60), newMsg]);

        if (Math.random() < 0.45) {
          burstTimeoutId = setTimeout(() => {
            const burstIdx = poolIndexRef.current % ALL_CHAT_MESSAGES.length;
            const burstData = ALL_CHAT_MESSAGES[burstIdx];
            poolIndexRef.current += 1;

            const secondMsg: ChatMessage = {
              id: `stream-burst-${Date.now()}-${burstIdx}`,
              userName: burstData.userName,
              district: burstData.district,
              text: burstData.text,
              timeString: 'এইমাত্র'
            };

            setMessages((prev) => [...prev.slice(-60), secondMsg]);
          }, 2200);
        }

        scheduleNextMessage();
      }, randomDelay);
    };

    scheduleNextMessage();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (burstTimeoutId) clearTimeout(burstTimeoutId);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      userName: profile?.fullName || 'You',
      district: 'Student Account',
      text: cleanText,
      timeString: 'এইমাত্র',
      isUser: true
    };

    setMessages((prev) => [...prev.slice(-60), userMsg]);
    setInputText('');
    setTimeout(scrollToBottom, 50);

    const peerReply = getContextualPeerReply(cleanText);
    if (peerReply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(-60),
          {
            id: `reply-${Date.now()}`,
            userName: peerReply.userName,
            district: peerReply.district,
            text: peerReply.text,
            timeString: 'এইমাত্র'
          }
        ]);
      }, 2800);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-166px)] p-3.5 sm:p-4 space-y-2.5 bg-[#F4F5F7]">
      {/* Formal Messaging Header */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
            <MessageSquare size={17} strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              লাইভ স্টুডেন্ট চ্যাটরুম
            </h1>
            <p className="text-[11px] text-[#0D7A5F] font-medium tabular-nums">
              {onlineCount} জন মেম্বার সক্রিয় আছেন
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-2.5 p-3 bg-white rounded-xl border border-slate-200/90 relative hide-scrollbar"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.isUser ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {msg.isUser && profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={msg.userName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#0A4D8C] shrink-0"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-[0_1px_2px_rgba(15,23,42,0.06)] ${
                  msg.isUser
                    ? 'bg-[#0A4D8C] text-white border-[#0A4D8C]'
                    : getAvatarColorClass(msg.userName)
                }`}
              >
                <UserIcon size={13} strokeWidth={2} />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[82%] sm:max-w-[76%] rounded-xl px-3.5 py-2.5 space-y-1 ${
                msg.isUser
                  ? 'bg-[#0A4D8C] text-white'
                  : 'bg-[#F8FAFC] text-slate-800 border border-slate-200/90'
              }`}
            >
              <div className={`flex items-center justify-between gap-3 border-b pb-1 ${msg.isUser ? 'border-white/15' : 'border-slate-200/70'}`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`font-semibold text-[11.5px] truncate ${msg.isUser ? 'text-white' : 'text-slate-900'}`}>
                    {msg.userName}
                  </span>
                  {msg.district && !msg.isUser && (
                    <span className="text-[10.5px] text-slate-400 shrink-0">· {msg.district}</span>
                  )}
                </div>

                <span className={`text-[10px] font-mono shrink-0 ${msg.isUser ? 'text-white/75' : 'text-slate-400'}`}>
                  {msg.timeString}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${msg.isUser ? 'text-white' : 'text-slate-700'}`}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Input Bar placed cleanly right above Bottom Nav */}
      <div className="fixed bottom-[52px] left-0 right-0 max-w-[520px] md:max-w-3xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-2 bg-[#F4F5F7] border-t border-slate-200/80 z-30">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="আপনার প্রশ্ন, কাজের সমস্যা বা অভিজ্ঞতা লিখুন..."
            className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0A4D8C] focus:bg-white transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#0A4D8C] hover:bg-[#083D70] disabled:opacity-40 text-white px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center justify-center shrink-0"
            title="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
