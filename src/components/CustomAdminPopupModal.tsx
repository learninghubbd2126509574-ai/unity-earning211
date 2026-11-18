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

  const cleanMessage = (popupData.message || '').replace(/\u00A0/g, ' ');
  const messageLines = cleanMessage.split('\n');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] overflow-y-auto">
      <div className="bg-white border border-slate-200 text-[#1E2329] rounded-xl w-full max-w-[440px] shadow-lg relative flex flex-col max-h-[88vh] p-5 my-auto space-y-4">
        
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#EEF5FC] border border-[#D4E4F7] text-[#0A4D8C] flex items-center justify-center shrink-0">
              <Megaphone size={18} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#0A4D8C] block">
                অফিশিয়াল নোটিশ
              </span>
              <h3 className="font-semibold text-[#1E2329] text-sm sm:text-base leading-snug break-words">
                {popupData.title || 'জরুরি নোটিশ'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition shrink-0"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="w-full min-w-0 bg-[#F4F5F7] p-4 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed min-h-[120px] max-h-[52vh] overflow-y-auto">
          <div className="space-y-1.5">
            {messageLines.map((line, idx) => (
              <p
                key={idx}
                className="break-words whitespace-pre-wrap leading-relaxed text-slate-700"
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#0A4D8C] hover:bg-[#083E72] text-white font-medium py-2.5 px-4 rounded-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 size={16} />
          <span>{popupData.buttonText || 'বুঝেছি / বন্ধ করুন'}</span>
        </button>
      </div>
    </div>
  );
};
