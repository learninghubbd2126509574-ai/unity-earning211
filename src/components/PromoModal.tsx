import React from 'react';
import { Sparkles, ArrowRight, X, Flame, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Icon Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-900/30 hover:bg-slate-900/60 text-white flex items-center justify-center transition cursor-pointer"
          title="বন্ধ করুন (Close)"
        >
          <X size={16} />
        </button>

        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white p-4 pt-5 text-center relative">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <Sparkles size={13} className="text-amber-400" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-orange-400">Unity Earning</h3>
            <Sparkles size={13} className="text-amber-400" />
          </div>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">
            Official Announcement
          </p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          
          {/* Flame Pill */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-black uppercase tracking-wide shadow-xs">
              <Flame size={13} className="animate-pulse" />
              <span>Special Offer Running!</span>
            </span>
          </div>

          {/* Offer Highlight Box - 20% Extra Commission */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 text-center text-white border border-emerald-500/40 shadow-sm space-y-1.5">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              Typing, Form Fill-up & Data Entry Projects
            </div>
            <div className="text-[11px] text-slate-200">
              Get extra on every project completion
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight flex items-center justify-center gap-1.5 py-0.5 font-mono">
              <span>20% Extra</span>
              <span className="text-[11px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-lg shadow-xs">
                Commission 💰
              </span>
            </div>
            <div className="text-[10px] text-emerald-300/90 font-medium pt-0.5">
              Offer available for a limited time
            </div>
          </div>

          {/* Warning Box */}
          <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-950 text-[11px] flex items-start gap-2 shadow-2xs">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>⚠️ Important Note:</strong> When transferring funds to Main Account, ensure you use your correct 7-digit profile ID Code.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                navigate('/my-work');
              }}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 text-xs cursor-pointer border border-orange-400/30"
            >
              <span>🚀 Start working now!</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer border border-slate-200"
            >
              Skip / Okay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
