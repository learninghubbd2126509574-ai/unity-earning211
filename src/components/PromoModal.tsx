import React from 'react';
import { ArrowRight, X, AlertTriangle, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
      <div className="w-full max-w-[360px] bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        
        {/* Close Icon Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Top Header */}
        <div className="bg-[#0A4D8C] text-white px-5 py-4 border-b border-[#083D70]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Megaphone size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">Unity Earning</h3>
              <p className="text-[11px] text-white/75">Official Announcement</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-3.5">
          {/* Offer Highlight Box */}
          <div className="bg-[#22262C] rounded-xl p-4 text-center text-white space-y-1">
            <div className="text-[11px] font-medium text-white/75">
              Typing, Form Fill-up & Data Entry Projects
            </div>
            <div className="text-2xl font-semibold font-mono tabular-nums text-white tracking-tight py-0.5">
              20% Extra Commission
            </div>
            <div className="text-[11px] text-emerald-300 font-medium">
              Active bonus applied on project completion
            </div>
          </div>

          {/* Warning Box */}
          <div className="p-3 bg-[#FEF7E0] border border-[#F3DFA2] rounded-lg text-[#5F4B16] text-xs flex items-start gap-2">
            <AlertTriangle size={15} className="text-[#B47B00] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Note:</strong> When transferring funds to Main Account, verify your 7-digit Account ID Code.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                navigate('/my-work');
              }}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <span>Start Working Now</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors text-xs cursor-pointer border border-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

