import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShieldCheck, Delete, RotateCcw, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PinLockScreenProps {
  onSuccess: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [targetPin, setTargetPin] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const navigate = useNavigate();

  // Listen to the Admin-configured PIN in real-time (read-only)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'appConfig'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data?.accessPin && typeof data.accessPin === 'string') {
          setTargetPin(data.accessPin);
        }
      }
    }, (err) => {
      console.warn("Using fallback default PIN '1234'", err);
    });

    return () => unsub();
  }, []);

  const handleDigit = (digit: string) => {
    if (isVerifying || pin.length >= 4) return;
    setErrorMsg('');
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setIsVerifying(true);
      setTimeout(() => {
        if (newPin === targetPin) {
          onSuccess();
        } else {
          setIsShaking(true);
          setErrorMsg('Incorrect PIN. Please enter the 4-digit security access code.');
          setTimeout(() => {
            setPin('');
            setIsVerifying(false);
            setIsShaking(false);
          }, 550);
        }
      }, 200);
    }
  };

  const handleClear = () => {
    if (isVerifying) return;
    setPin('');
    setErrorMsg('');
  };

  const handleBackspace = () => {
    if (isVerifying) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px] bg-white rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.06)] border border-slate-200/90 p-7 flex flex-col items-center select-none">
        
        <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] border border-[#D4E4F7] flex items-center justify-center text-[#0A4D8C] mb-4">
          <ShieldCheck size={24} strokeWidth={1.75} />
        </div>

        <h1 className="text-lg font-semibold text-[#1E2329] tracking-tight text-center">
          Security Access PIN
        </h1>
        <p className="text-xs text-slate-500 mt-1 text-center max-w-[260px] leading-relaxed">
          Enter your 4-digit portal security PIN to continue.
        </p>

        {/* 4 PIN Indicator Dots */}
        <div className={`flex justify-center items-center gap-4 my-6 py-1 ${isShaking ? 'translate-x-1 transition-transform' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-colors duration-150 border ${
                  isFilled
                    ? 'bg-[#0A4D8C] border-[#0A4D8C]'
                    : 'bg-slate-100 border-slate-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error / Status Feedback */}
        <div className="min-h-[24px] flex items-center justify-center mb-2 px-2">
          {errorMsg ? (
            <span className="text-xs font-medium text-rose-600 text-center">
              {errorMsg}
            </span>
          ) : isVerifying ? (
            <span className="text-xs font-medium text-slate-500">Verifying PIN...</span>
          ) : null}
        </div>

        {/* Formal Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[264px] mt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-lg bg-slate-50 hover:bg-[#EEF5FC] active:bg-[#D4E4F7] text-[#1E2329] hover:text-[#0A4D8C] text-xl font-semibold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer tabular-nums"
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-medium border border-slate-200 transition-colors flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            title="Clear"
          >
            <RotateCcw size={15} strokeWidth={1.75} />
            <span className="text-[11px]">Clear</span>
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-lg bg-slate-50 hover:bg-[#EEF5FC] active:bg-[#D4E4F7] text-[#1E2329] hover:text-[#0A4D8C] text-xl font-semibold border border-slate-200 transition-colors flex items-center justify-center cursor-pointer tabular-nums"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-medium border border-slate-200 transition-colors flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            title="Delete"
          >
            <Delete size={16} strokeWidth={1.75} />
            <span className="text-[11px]">Delete</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-4 border-t border-slate-100 w-full flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock size={13} strokeWidth={1.75} /> Protected Access
          </span>
          <button
            onClick={() => navigate('/admin-login')}
            className="text-[#0A4D8C] hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            Admin Portal <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
