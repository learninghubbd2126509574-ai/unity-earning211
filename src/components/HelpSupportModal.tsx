import React, { useState } from 'react';
import { X, Send, MessageCircle, PlayCircle, HelpCircle, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramUrl?: string;
  whatsappUrl?: string;
  videoUrl?: string;
  onOpenVideoGuide?: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  telegramUrl,
  whatsappUrl,
  videoUrl,
  onOpenVideoGuide
}) => {
  const [linkNotice, setLinkNotice] = useState<string | null>(null);
  if (!isOpen) return null;

  const handleOpenLink = (url?: string, fallbackMessage?: string) => {
    setLinkNotice(null);
    if (url && url.trim()) {
      let target = url.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      const a = document.createElement('a');
      a.href = target;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } else {
      setLinkNotice(fallbackMessage || 'Support channel link is currently being updated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
      <div className="w-full max-w-[380px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
        
        {/* Clean Formal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] flex items-center justify-center border border-[#D4E4F7]">
              <HelpCircle size={18} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1E2329]">Live Support Channels</h2>
              <p className="text-[11px] text-slate-500">Official helpdesk & tutorial resources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Channels List */}
        <div className="p-4 space-y-2.5 bg-[#F4F5F7]">
          {linkNotice && (
            <div className="p-2.5 bg-[#FEF7E0] border border-[#F3DFA2] text-[#5F4B16] rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-[#B47B00]" />
              <span>{linkNotice}</span>
            </div>
          )}
          <button
            onClick={() => handleOpenLink(whatsappUrl || 'https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p', 'WhatsApp support link is being updated.')}
            className="w-full p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0">
                <MessageCircle size={18} strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#1E2329]">WhatsApp Support Channel</h4>
                <p className="text-[11px] text-slate-500">Direct announcements & helpline</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => handleOpenLink(telegramUrl || 'https://t.me/unityearning', 'Telegram channel link is being updated.')}
            className="w-full p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EEF5FC] text-[#0A4D8C] border border-[#D4E4F7] flex items-center justify-center shrink-0">
                <Send size={17} strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#1E2329]">Telegram Helpline</h4>
                <p className="text-[11px] text-slate-500">Updates & live support desk</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => {
              if (onOpenVideoGuide) {
                onClose();
                onOpenVideoGuide();
              } else {
                handleOpenLink(videoUrl || 'https://youtube.com', 'Tutorial video guide is being updated.');
              }
            }}
            className="w-full p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                <PlayCircle size={18} strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#1E2329]">Video Guide & Tutorial</h4>
                <p className="text-[11px] text-slate-500">Watch directly on Home page</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>Verified Official Support Channels</span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white hover:bg-slate-100 text-[#1E2329] font-medium py-2.5 rounded-lg border border-slate-200 transition text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
