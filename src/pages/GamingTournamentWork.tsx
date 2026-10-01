import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Gamepad2, Trophy, Timer, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const QUESTIONS = [
  {
    question: 'Which technology protocol is standard for secure web transactions?',
    options: ['FTP', 'HTTPS', 'SMTP', 'POP3'],
    correct: 1
  },
  {
    question: 'What is the primary function of a relational database foreign key?',
    options: ['Compress files', 'Enforce referential integrity', 'Generate UI', 'Encrypt passwords'],
    correct: 1
  },
  {
    question: 'In digital marketing, what does CPC represent?',
    options: ['Cost Per Click', 'Content Per Category', 'Channel Privacy Code', 'Customer Profit Call'],
    correct: 0
  }
];

export const GamingTournamentWork: React.FC = () => {
  return (
    <ModuleGuard moduleId="gaming" title="Gaming Tournament">
      <GamingTournamentApp />
    </ModuleGuard>
  );
};

const GamingTournamentApp: React.FC = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (gameState === 'playing' && !isAnswerChecked && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && !isAnswerChecked && timeLeft === 0) {
      handleOptionSelect(-1); // Timed out
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, isAnswerChecked, timeLeft]);

  const startTournament = () => {
    setGameState('playing');
    setCurrentQIndex(0);
    setScore(0);
    setTimeLeft(10);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setRewardClaimed(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
    setIsAnswerChecked(true);

    const isCorrect = index === QUESTIONS[currentQIndex].correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQIndex + 1 < QUESTIONS.length) {
        setCurrentQIndex(prev => prev + 1);
        setTimeLeft(10);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const handleClaimPrize = async () => {
    if (!user || rewardClaimed) return;
    try {
      const prizeAmount = score >= 2 ? 1.50 : 0.50;
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(prizeAmount)
      });
      setRewardClaimed(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 pb-24 h-full overflow-y-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 text-fuchsia-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={16} /> Competitive E-Sports Arena
        </div>
        <h1 className="text-xl font-bold">Gaming Tournament</h1>
        <p className="text-xs text-fuchsia-100 mt-1 leading-relaxed">
          Test your speed and digital knowledge in real-time speed rounds to claim instant tournament rewards.
        </p>
      </div>

      {gameState === 'lobby' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md text-center space-y-4">
          <div className="w-16 h-16 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Gamepad2 size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Knowledge Speed Challenge</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Answer 3 fast questions under 10 seconds each. Earn up to <span className="font-bold text-emerald-600">BDT 1.50</span> for high accuracy!
          </p>

          <button
            onClick={startTournament}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-md text-xs active:scale-[0.99]"
          >
            Enter Tournament Round
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 font-mono">
              Question {currentQIndex + 1} of {QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-full">
              <Timer size={14} className="animate-spin" /> {timeLeft}s
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 leading-snug">
            {QUESTIONS[currentQIndex].question}
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {QUESTIONS[currentQIndex].options.map((opt, idx) => {
              let btnStyle = 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300';
              if (isAnswerChecked) {
                if (idx === QUESTIONS[currentQIndex].correct) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (idx === selectedOption) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerChecked}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                >
                  <span className="font-mono font-bold mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <Trophy size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tournament Completed!</h3>
          <p className="text-xs text-slate-500">
            You scored <span className="font-bold text-slate-800">{score}</span> out of <span className="font-bold text-slate-800">{QUESTIONS.length}</span> correct answers.
          </p>

          {!rewardClaimed ? (
            <button
              onClick={handleClaimPrize}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow-md text-xs flex items-center justify-center gap-1.5"
            >
              <Award size={16} /> Claim Tournament Prize ({score >= 2 ? 'BDT 1.50' : 'BDT 0.50'})
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
              ✓ Reward deposited into your account balance!
            </div>
          )}

          <button
            onClick={startTournament}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-xs"
          >
            Play Another Round
          </button>
        </div>
      )}
    </div>
  );
};
