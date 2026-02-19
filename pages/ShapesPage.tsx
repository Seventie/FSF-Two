import React, { useCallback, useEffect, useState } from 'react';
import { SHAPE_CHOICES, ShapeChoice } from '../constants';

interface ShapesPageProps {
  onBack: () => void;
  onCorrect: () => void;
  score: number;
}

const shuffle = <T,>(items: T[]): T[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const ShapesPage: React.FC<ShapesPageProps> = ({ onBack, onCorrect, score }) => {
  const [targetShape, setTargetShape] = useState<ShapeChoice>(SHAPE_CHOICES[0]);
  const [choices, setChoices] = useState<ShapeChoice[]>(SHAPE_CHOICES);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const generateRound = useCallback(() => {
    const roundChoices = shuffle(SHAPE_CHOICES);
    setChoices(roundChoices);
    setTargetShape(roundChoices[Math.floor(Math.random() * roundChoices.length)]);
    setFeedback('idle');
  }, []);

  useEffect(() => {
    generateRound();
  }, [generateRound]);

  const handleChoice = (shape: ShapeChoice) => {
    if (feedback === 'correct') {
      return;
    }

    if (shape.id === targetShape.id) {
      setFeedback('correct');
      onCorrect();
      window.setTimeout(() => {
        generateRound();
      }, 1300);
      return;
    }

    setFeedback('wrong');
    window.setTimeout(() => setFeedback('idle'), 700);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen px-6 py-20">
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-50">
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest opacity-70">Stars</p>
          <p className="text-xl font-display">⭐ {score}</p>
        </div>
      </div>

      <header className="max-w-3xl mx-auto mt-12 text-center">
        <h1 className="text-xs uppercase tracking-[0.35em] font-bold mb-6 opacity-70">04. Shape Match</h1>
        <p className="text-3xl md:text-5xl font-display leading-tight">
          Tap the <span className="text-amber-100 font-semibold">{targetShape.name}</span>
        </p>
        <p className="mt-3 text-sm opacity-80">{targetShape.hint}</p>
      </header>

      <main className="max-w-4xl mx-auto w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {choices.map((shape) => (
          <button
            key={shape.id}
            onClick={() => handleChoice(shape)}
            className="rounded-3xl border border-white/50 bg-white/20 hover:bg-white/30 transition-all p-6 shadow-lg text-center"
          >
            <div className="text-7xl mb-4" role="img" aria-label={shape.name}>
              {shape.emoji}
            </div>
            <p className="text-xl font-display">{shape.name}</p>
          </button>
        ))}
      </main>

      <div className="h-20 flex items-center justify-center mt-8">
        {feedback === 'correct' && <p className="text-3xl font-display tracking-wider text-amber-100">Great job!</p>}
        {feedback === 'wrong' && <p className="text-2xl font-display tracking-wider text-rose-100">Try again</p>}
      </div>
    </div>
  );
};

export default ShapesPage;
