import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '../components/ModuleGuard';
import { Gamepad2, Trophy, Timer, Award, CheckCircle2 } from 'lucide-react';
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
      handleOptionSelect(-1);
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
    <div className="min-h-full bg-[#F4F5F7] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Banner */}
        <div className="bg-[#0A4D8C] rounded-xl p-5 text-white border border-[#083D70]">
          <div className="text-[11px] font-medium text-white/80 mb-1">
            Competitive Assessment Arena
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Gaming Tournament</h1>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Test your speed and digital knowledge in timed speed rounds to claim instant tournament rewards.
          </p>
        </div>

        {gameState === 'lobby' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 text-center space-y-4">
            <div className="w-14 h-14 bg-[#EEF5FC] text-[#0A4D8C] rounded-xl flex items-center justify-center mx-auto border border-[#D4E4F7]">
              <Gamepad2 size={28} />
            </div>
            <h3 className="text-base font-semibold text-[#111827]">Knowledge Speed Challenge</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Answer 3 quick questions under 10 seconds each. Earn up to <span className="font-semibold font-mono text-[#0D7A5F]">BDT 1.50</span> for high accuracy.
            </p>

            <button
              onClick={startTournament}
              className="w-full bg-[#0A4D8C] hover:bg-[#083D70] text-white font-semibold py-3 rounded-lg transition-colors text-xs cursor-pointer"
            >
              Enter Tournament Round
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500 font-mono tabular-nums">
                Question {currentQIndex + 1} of {QUESTIONS.length}
              </span>
              <div className="flex items-center gap-1.5 font-mono tabular-nums text-xs font-semibold text-[#0A4D8C]">
                <Timer size={14} />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-[#111827] leading-snug">
              {QUESTIONS[currentQIndex].question}
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {QUESTIONS[currentQIndex].options.map((opt, idx) => {
                let btnStyle = 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#0A4D8C]/40';
                if (isAnswerChecked) {
                  if (idx === QUESTIONS[currentQIndex].correct) {
                    btnStyle = 'border-[#0D7A5F] bg-[#ECFDF5] text-[#065F46] font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerChecked}
                    onClick={() => handleOptionSelect(idx)}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono font-semibold mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 text-center space-y-4">
            <div className="w-14 h-14 bg-[#FEF7E0] text-[#B47B00] border border-[#F3DFA2] rounded-xl flex items-center justify-center mx-auto">
              <Trophy size={28} />
            </div>
            <h3 className="text-base font-semibold text-[#111827]">Tournament Completed</h3>
            <p className="text-xs text-slate-600">
              You scored <span className="font-semibold font-mono text-[#111827]">{score}</span> out of <span className="font-semibold font-mono text-[#111827]">{QUESTIONS.length}</span> correct answers.
            </p>

            {!rewardClaimed ? (
              <button
                onClick={handleClaimPrize}
                className="w-full bg-[#0D7A5F] hover:bg-[#09604A] text-white font-semibold py-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award size={15} />
                <span>Claim Tournament Prize ({score >= 2 ? 'BDT 1.50' : 'BDT 0.50'})</span>
              </button>
            ) : (
              <div className="p-3 bg-[#ECFDF5] text-[#065F46] font-medium text-xs rounded-lg border border-[#A7F3D0] flex items-center justify-center gap-2">
                <CheckCircle2 size={15} />
                <span>Reward deposited into your account balance.</span>
              </div>
            )}

            <button
              onClick={startTournament}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors text-xs cursor-pointer"
            >
              Play Another Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

