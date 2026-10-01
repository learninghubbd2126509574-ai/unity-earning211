import React from 'react';
import { Sparkles, ArrowRight, Zap, X, Flame, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Icon Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-7 h-7 rounded-full bg-slate-900/30 hover:bg-slate-900/50 text-white flex items-center justify-center transition cursor-pointer"
          title="Close"
        >
          <X size={15} />
        </button>

        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 pt-5 text-center relative">
          <h3 className="font-extrabold text-xs tracking-wider uppercase text-orange-400">Unity Earning</h3>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">
            E-Learning Platform
          </p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          
          {/* Flame Pill */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-black uppercase tracking-wide shadow-xs">
              <Flame size={13} /> বিশেষ অফার চলছে!
            </span>
          </div>

          {/* Offer Highlight Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-2xl p-3.5 text-center text-white border border-emerald-500/30 shadow-xs space-y-1">
            <div className="text-xs font-bold text-emerald-300">
              Form Fill Up & Data Entry Project
            </div>
            <div className="text-[11px] text-slate-200">
              ১টি Project Complete করলেই পাবেন
            </div>
            <div className="text-2xl font-black text-yellow-300 tracking-tight flex items-center justify-center gap-1.5 pt-0.5">
              <span>20% Extra</span>
              <span className="text-[10px] bg-yellow-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">
                Commission 💰
              </span>
            </div>
            <div className="text-[10px] text-emerald-300/90 font-medium">
              অফারটি চলবে আরও ৪ দিন
            </div>
          </div>

          {/* Warning Box */}
          <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-950 text-[11px] flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>⚠️ গুরুত্বপূর্ণ:</strong> Main Account-এ টাকা Transfer করার সময় অবশ্যই সঠিক ৭-ডিজিটের ID Code দিন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-0.5">
            <button
              onClick={() => {
                onClose();
                navigate('/my-work');
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold py-2.5 px-3 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <span>🚀 এখনই কাজ শুরু করুন!</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl transition text-xs cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
