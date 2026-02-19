import React, { useState, useEffect, useCallback } from 'react';
import { CountingMode } from '../types';
import { EMOJIS } from '../constants';
import NumericInput from '../components/NumericInput';
import EmojiGroup from '../components/EmojiGroup';
import NumberLabel from '../components/NumberLabel';

interface CountingPageProps {
  onBack: () => void;
  onCorrect: () => void;
  score: number;
}

const CountingPage: React.FC<CountingPageProps> = ({ onBack, onCorrect, score }) => {
  const [mode, setMode] = useState<CountingMode>(CountingMode.COUNT_AND_ENTER);
  const [targetCount, setTargetCount] = useState(5);
  const [currentCount, setCurrentCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNew = useCallback(() => {
    setTargetCount(Math.floor(Math.random() * 9) + 2);
    setCurrentCount(0);
    setUserAnswer('');
    setIsCorrect(false);
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  }, []);

  useEffect(() => {
    generateNew();
  }, [mode, generateNew]);

  useEffect(() => {
    if (isCorrect) {
      return;
    }

    let correct = false;
    if (mode === CountingMode.COUNT_AND_ENTER) {
      correct = userAnswer !== '' && parseInt(userAnswer, 10) === targetCount;
    } else {
      correct = currentCount > 0 && currentCount === targetCount;
    }

    if (correct) {
      setIsCorrect(true);
      onCorrect();
    }

    return undefined;
  }, [userAnswer, currentCount, targetCount, mode, generateNew, onCorrect, isCorrect]);

  useEffect(() => {
    if (!isCorrect) {
      return;
    }

    const timer = window.setTimeout(() => {
      generateNew();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isCorrect, generateNew]);

  const handleAddOne = () => {
    if (currentCount < 20 && !isCorrect) {
      setCurrentCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    if (!isCorrect) {
      setCurrentCount(0);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative pb-20">
      <header className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <button
            onClick={onBack}
            className="text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
          </button>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight font-display">02. Counting</h1>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="flex border border-white/40 rounded-full p-1 bg-white/20 backdrop-blur-md">
            <button
              onClick={() => setMode(CountingMode.COUNT_AND_ENTER)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${mode === CountingMode.COUNT_AND_ENTER ? 'bg-amber-100 text-slate-900 shadow-lg' : 'text-white/80 hover:text-white'}`}
            >
              Count & Type
            </button>
            <button
              onClick={() => setMode(CountingMode.BUILD_THE_COUNT)}
              className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${mode === CountingMode.BUILD_THE_COUNT ? 'bg-amber-100 text-slate-900 shadow-lg' : 'text-white/80 hover:text-white'}`}
            >
              Build It
            </button>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-70">Stars</p>
            <p className="text-xl font-display">⭐ {score}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 mt-20 relative gap-12">
        <div className="flex-1 flex flex-col items-center justify-center md:items-start w-full">
          <div className="w-full max-w-md">
            {mode === CountingMode.COUNT_AND_ENTER ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xs uppercase tracking-[0.4em] font-light opacity-70">Counting Task</h2>
                  <p className="text-4xl md:text-5xl font-light font-display leading-tight">Count the items on the right.</p>
                </div>
                <NumericInput value={userAnswer} onChange={setUserAnswer} label="Your Count" autoFocus />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xs uppercase tracking-[0.4em] font-light opacity-70">Goal</h2>
                  <p className="text-4xl md:text-5xl font-light font-display leading-tight">Can you build exactly {targetCount}?</p>
                </div>
                <div
                  className={`text-[12rem] md:text-[16rem] leading-none font-light tracking-tighter font-display transition-all duration-500 ${isCorrect ? 'text-amber-100 scale-105' : 'opacity-90'}`}
                >
                  {targetCount}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-lg">
            <EmojiGroup
              emoji={emoji}
              count={mode === CountingMode.COUNT_AND_ENTER ? targetCount : currentCount}
              className={`min-h-[300px] transition-all duration-300 ${isCorrect ? 'border-amber-100 bg-amber-100/20' : ''}`}
            />
            <NumberLabel value={mode === CountingMode.COUNT_AND_ENTER ? targetCount : currentCount} className="mt-4" />
          </div>
        </div>

        {mode === CountingMode.BUILD_THE_COUNT && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/40 shadow-2xl z-40">
            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full border border-white/50 hover:border-white transition-all duration-300 flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-500">refresh</span>
            </button>

            <button
              onClick={handleAddOne}
              disabled={isCorrect}
              className="group relative flex items-center justify-center w-20 h-20 rounded-full border-2 border-white hover:bg-amber-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:ring-offset-4 focus:ring-offset-[#7d5635] disabled:opacity-20 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined text-4xl group-hover:text-slate-900 transition-colors duration-300">add</span>
            </button>
          </div>
        )}

        {isCorrect && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100] animate-in fade-in zoom-in duration-300">
            <div className="bg-[#5a3e2b]/60 backdrop-blur-md w-full h-full flex items-center justify-center">
              <div className="text-amber-100 font-display text-7xl md:text-9xl uppercase tracking-[0.5em] animate-bounce text-center">
                Perfect!
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CountingPage;
