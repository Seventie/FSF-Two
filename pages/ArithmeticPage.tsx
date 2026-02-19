import React, { useState, useEffect, useCallback } from 'react';
import EmojiGroup from '../components/EmojiGroup';
import NumericInput from '../components/NumericInput';
import NumberLabel from '../components/NumberLabel';
import { EMOJIS } from '../constants';
import { ArithmeticType } from '../types';

interface ArithmeticPageProps {
  onBack: () => void;
  onCorrect: () => void;
  score: number;
}

const ArithmeticPage: React.FC<ArithmeticPageProps> = ({ onBack, onCorrect, score }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [opType, setOpType] = useState<ArithmeticType>(ArithmeticType.ADDITION);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const generateProblem = useCallback(() => {
    const type = Math.random() > 0.5 ? ArithmeticType.ADDITION : ArithmeticType.SUBTRACTION;
    const n1 = Math.floor(Math.random() * 5) + 3;
    const n2 = Math.floor(Math.random() * 3) + 1;

    const finalN1 = type === ArithmeticType.SUBTRACTION ? Math.max(n1, n2) : n1;
    const finalN2 = type === ArithmeticType.SUBTRACTION ? Math.min(n1, n2) : n2;

    setNum1(finalN1);
    setNum2(finalN2);
    setOpType(type);
    setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setUserAnswer('');
    setIsCorrect(false);
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  const correctAnswer = opType === ArithmeticType.ADDITION ? num1 + num2 : num1 - num2;

  useEffect(() => {
    if (isCorrect) {
      return;
    }

    if (userAnswer !== '' && parseInt(userAnswer, 10) === correctAnswer) {
      setIsCorrect(true);
      onCorrect();
    }

    return undefined;
  }, [userAnswer, correctAnswer, onCorrect, isCorrect]);

  useEffect(() => {
    if (!isCorrect) {
      return;
    }

    const timer = window.setTimeout(generateProblem, 1200);
    return () => window.clearTimeout(timer);
  }, [isCorrect, generateProblem]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 py-20">
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-50">
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest opacity-70">Score</p>
          <p className="text-xl font-display">⭐ {score}</p>
        </div>
      </div>

      <header className="mb-16 text-center">
        <h1 className="text-xs uppercase tracking-[0.4em] font-light mb-8 opacity-70">Arithmetic // Lvl.1</h1>
        <div
          className={`text-7xl md:text-9xl font-light tracking-tight leading-none font-display transition-all duration-500 ${isCorrect ? 'scale-110 text-amber-100' : ''}`}
        >
          {num1} {opType === ArithmeticType.ADDITION ? '+' : '−'} {num2}
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center gap-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full">
          <div className="flex flex-col items-center">
            <EmojiGroup emoji={emoji} count={num1} />
            <NumberLabel value={num1} />
          </div>

          <div className="text-4xl font-light opacity-80 font-display">
            {opType === ArithmeticType.ADDITION ? '+' : '−'}
          </div>

          <div className="flex flex-col items-center">
            <EmojiGroup emoji={emoji} count={num2} />
            <NumberLabel value={num2} />
          </div>
        </div>

        <div className="w-full max-w-md mt-8 flex flex-col items-center gap-12">
          <div className="w-full">
            <NumericInput value={userAnswer} onChange={setUserAnswer} autoFocus label="Type Your Answer" />
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Your Result Preview</h3>
            <EmojiGroup
              emoji={emoji}
              count={parseInt(userAnswer, 10) || 0}
              className={`transition-all duration-300 min-h-[100px] flex justify-center items-center w-full max-w-sm ${isCorrect ? 'border-amber-100 bg-amber-100/20' : ''}`}
            />
          </div>
        </div>
      </main>

      {isCorrect && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 text-amber-100 font-display text-2xl uppercase tracking-[0.4em] animate-pulse pointer-events-none">
          Brilliant!
        </div>
      )}
    </div>
  );
};

export default ArithmeticPage;
