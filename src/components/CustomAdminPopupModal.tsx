import React from 'react';
import { Megaphone, X, CheckCircle2 } from 'lucide-react';

interface AdminPopupData {
  title: string;
  message: string;
  buttonText: string;
}

interface CustomAdminPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  popupData: AdminPopupData | null;
}

export const CustomAdminPopupModal: React.FC<CustomAdminPopupModalProps> = ({ isOpen, onClose, popupData }) => {
  if (!isOpen || !popupData) return null;

  // Clean message: normalize non-breaking spaces and split into lines for clean vertical line-by-line wrapping
  const cleanMessage = (popupData.message || '').replace(/\u00A0/g, ' ');
  const messageLines = cleanMessage.split('\n');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border-2 border-orange-500/80 text-white rounded-3xl w-full max-w-[460px] shadow-2xl relative overflow-hidden flex flex-col max-h-[88vh] p-5 sm:p-6 animate-in zoom-in-95 my-auto">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/90 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold border border-slate-700 transition z-10"
          title="বন্ধ করুন (Close)"
        >
          <X size={16} />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5 min-w-0 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <Megaphone size={22} className="animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30 inline-block">
              গুরুত্বপূর্ণ বার্তা
            </span>
            <h3 className="font-black text-white text-base sm:text-lg leading-tight mt-1 break-words [overflow-wrap:anywhere] line-clamp-2">
              {popupData.title || 'অফিশিয়াল জরুরি নোটিশ'}
            </h3>
          </div>
        </div>

        {/* Notice Message Content - Contained & Scrollable */}
        <div className="w-full min-w-0 max-w-full my-3 bg-slate-950/95 p-4 sm:p-5 rounded-2xl border border-slate-800/90 text-sm sm:text-base text-slate-100 leading-relaxed min-h-[140px] max-h-[52vh] overflow-y-auto overflow-x-hidden shadow-inner flex-1">
          <div className="w-full min-w-0 max-w-full text-left space-y-1.5">
            {messageLines.map((line, idx) => (
              <p
                key={idx}
                className="w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-pre-wrap leading-relaxed text-slate-200"
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-black py-3.5 rounded-xl transition text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer border border-orange-400/30"
          >
            <CheckCircle2 size={18} />
            <span>{popupData.buttonText || 'বুঝেছি / ঠিক আছে'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
