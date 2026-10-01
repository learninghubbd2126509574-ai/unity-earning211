import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShieldCheck, Delete, RotateCcw, Lock, ArrowRight, KeyRound } from 'lucide-react';
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

  // Listen to the Admin-configured PIN in real-time
  useEffect(() => {
    // Initial check & default bootstrap
    const checkAndInitPin = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'appConfig'));
        if (!snap.exists() || !snap.data()?.accessPin) {
          await setDoc(doc(db, 'settings', 'appConfig'), {
            accessPin: '1234',
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        // Fallback to local default
      }
    };
    checkAndInitPin();

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

    // Auto verify when 4 digits are completed
    if (newPin.length === 4) {
      setIsVerifying(true);
      setTimeout(() => {
        if (newPin === targetPin) {
          onSuccess();
        } else {
          setIsShaking(true);
          setErrorMsg('Incorrect PIN code. Please try again.');
          setTimeout(() => {
            setPin('');
            setIsVerifying(false);
            setIsShaking(false);
          }, 600);
        }
      }, 250);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* White Clean Minimalist Card */}
      <div className="w-full max-w-[390px] bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center select-none">
        
        {/* Top Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-4 shadow-inner">
          <ShieldCheck size={36} />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
          Security Access PIN
        </h1>
        <p className="text-xs text-slate-400 mt-1 text-center max-w-[270px]">
          Enter the 4-digit security PIN to unlock portal access.
        </p>

        {/* 4 PIN Indicator Dots */}
        <div className={`flex justify-center items-center gap-4 my-6 py-2 ${isShaking ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-5 h-5 rounded-full transition-all duration-200 border-2 ${
                  isFilled
                    ? 'bg-slate-900 border-slate-900 scale-110 shadow-sm'
                    : 'bg-slate-100 border-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        <div className="h-6 flex items-center justify-center mb-2">
          {errorMsg ? (
            <span className="text-xs font-semibold text-rose-500 animate-pulse text-center">
              {errorMsg}
            </span>
          ) : isVerifying ? (
            <span className="text-xs font-medium text-slate-400">Verifying PIN code...</span>
          ) : null}
        </div>

        {/* Calculator-Style Keypad (1-9, C, 0, Backspace) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-50 active:text-orange-600 active:scale-95 text-slate-800 text-2xl font-semibold border border-slate-200/80 transition-all flex items-center justify-center shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Clear Key */}
          <button
            type="button"
            onClick={handleClear}
            className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 text-sm font-bold border border-slate-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
            title="Clear"
          >
            <RotateCcw size={18} />
            <span className="text-[10px] uppercase tracking-wider">Clear</span>
          </button>

          {/* Zero Key */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-orange-50 active:text-orange-600 active:scale-95 text-slate-800 text-2xl font-semibold border border-slate-200/80 transition-all flex items-center justify-center shadow-sm"
          >
            0
          </button>

          {/* Backspace Key */}
          <button
            type="button"
            onClick={handleBackspace}
            className="h-16 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-400 hover:text-slate-600 text-sm font-bold border border-slate-200/80 transition-all flex flex-col items-center justify-center gap-0.5"
            title="Backspace"
          >
            <Delete size={20} />
            <span className="text-[10px] uppercase tracking-wider">Delete</span>
          </button>
        </div>

        {/* Footer Admin Shortcut */}
        <div className="mt-8 pt-4 border-t border-slate-100 w-full flex justify-between items-center text-xs text-slate-400 px-2">
          <span className="flex items-center gap-1 font-medium">
            <Lock size={12} /> System Secured
          </span>
          <button
            onClick={() => navigate('/admin-login')}
            className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 hover:underline"
          >
            Admin Portal <ArrowRight size={12} />
          </button>
        </div>

      </div>
    </div>
  );
};
