import React from 'react';
import { X, Send, MessageCircle, PlayCircle, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramUrl?: string;
  whatsappUrl?: string;
  videoUrl?: string;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  telegramUrl,
  whatsappUrl,
  videoUrl
}) => {
  if (!isOpen) return null;

  const handleOpenLink = (url?: string, fallbackMessage?: string) => {
    if (url && url.trim()) {
      let target = url.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      window.open(target, '_blank');
    } else {
      alert(fallbackMessage || 'Support channel link is currently being updated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 pt-6 text-center relative">
          <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-orange-500/30">
            <HelpCircle size={26} />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Help & Official Support</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Direct 24/7 Helpline & Work Assistance</p>
        </div>

        {/* Channels List */}
        <div className="p-5 space-y-3">
          
          {/* Telegram Channel */}
          <button
            onClick={() => handleOpenLink(telegramUrl || 'https://t.me/unityearning', 'Telegram channel link is being updated.')}
            className="w-full p-3.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-100 rounded-2xl flex items-center justify-between transition cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Send size={20} className="-translate-x-0.5 translate-y-0.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sky-950 group-hover:text-sky-800">Telegram Helpline</h4>
                <p className="text-[10px] text-sky-600">Join official updates & live support</p>
              </div>
            </div>
            <ExternalLink size={15} className="text-sky-500" />
          </button>

          {/* WhatsApp Support */}
          <button
            onClick={() => handleOpenLink(whatsappUrl || 'https://wa.me/8801919012426', 'WhatsApp support link is being updated.')}
            className="w-full p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 rounded-2xl flex items-center justify-between transition cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800">WhatsApp Support</h4>
                <p className="text-[10px] text-emerald-600">Chat directly with team trainer</p>
              </div>
            </div>
            <ExternalLink size={15} className="text-emerald-500" />
          </button>

          {/* Video Tutorial Guide */}
          <button
            onClick={() => handleOpenLink(videoUrl || 'https://youtube.com', 'Tutorial video guide is being updated.')}
            className="w-full p-3.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 rounded-2xl flex items-center justify-between transition cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <PlayCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950 group-hover:text-rose-800">Video Guide & Tutorial</h4>
                <p className="text-[10px] text-rose-600">Watch step-by-step task instructions</p>
              </div>
            </div>
            <ExternalLink size={15} className="text-rose-500" />
          </button>

          {/* Safe Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Official Unity Earning Support Channels</span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer mt-1"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};
