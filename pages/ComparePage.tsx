import React, { useCallback, useEffect, useState } from 'react';
import EmojiGroup from '../components/EmojiGroup';
import { EMOJIS } from '../constants';

interface ComparePageProps {
  onBack: () => void;
  onCorrect: () => void;
  score: number;
}

const ComparePage: React.FC<ComparePageProps> = ({ onBack, onCorrect, score }) => {
  const [leftCount, setLeftCount] = useState(2);
  const [rightCount, setRightCount] = useState(4);
  const [leftEmoji, setLeftEmoji] = useState(EMOJIS[0]);
  const [rightEmoji, setRightEmoji] = useState(EMOJIS[1]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const generateRound = useCallback(() => {
    let nextLeft = Math.floor(Math.random() * 8) + 2;
    let nextRight = Math.floor(Math.random() * 8) + 2;

    while (nextLeft === nextRight) {
      nextRight = Math.floor(Math.random() * 8) + 2;
    }

    setLeftCount(nextLeft);
    setRightCount(nextRight);
    setLeftEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setRightEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setFeedback('idle');
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handlePick = (side: 'left' | 'right') => {
    if (feedback === 'correct') {
      return;
    }

    const correctSide = leftCount > rightCount ? 'left' : 'right';
    if (side === correctSide) {
      setFeedback('correct');
      onCorrect();
      window.setTimeout(generateRound, 1200);
      return;
    }

    setFeedback('wrong');
    window.setTimeout(() => setFeedback('idle'), 650);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-6 py-20">
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-50">
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest opacity-75">Stars</p>
          <p className="text-xl font-display">⭐ {score}</p>
        </div>
      </div>

      <header className="max-w-4xl mx-auto mt-12 text-center">
        <h1 className="text-xs uppercase tracking-[0.35em] font-bold mb-6 opacity-75">05. Which Side Has More?</h1>
        <p className="text-3xl md:text-5xl font-display leading-tight">Tap the side with more emojis</p>
      </header>

      <main className="max-w-6xl mx-auto w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handlePick('left')}
          className="rounded-3xl border border-white/40 bg-white/20 hover:bg-white/30 transition-all p-5 shadow-lg"
        >
          <p className="text-center text-xs uppercase tracking-[0.25em] opacity-75 mb-4">Left Side</p>
          <EmojiGroup emoji={leftEmoji} count={leftCount} className="min-h-[190px]" />
        </button>

        <button
          onClick={() => handlePick('right')}
          className="rounded-3xl border border-white/40 bg-white/20 hover:bg-white/30 transition-all p-5 shadow-lg"
        >
          <p className="text-center text-xs uppercase tracking-[0.25em] opacity-75 mb-4">Right Side</p>
          <EmojiGroup emoji={rightEmoji} count={rightCount} className="min-h-[190px]" />
        </button>
      </main>

      <div className="h-20 flex items-center justify-center mt-8">
        {feedback === 'correct' && <p className="text-3xl font-display tracking-wider text-amber-100">Nice choice!</p>}
        {feedback === 'wrong' && <p className="text-2xl font-display tracking-wider text-rose-100">Oops, try again</p>}
      </div>
    </div>
  );
};

export default ComparePage;
