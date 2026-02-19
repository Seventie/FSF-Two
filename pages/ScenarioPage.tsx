import React, { useState, useEffect, useCallback } from 'react';
import EmojiGroup from '../components/EmojiGroup';
import NumericInput from '../components/NumericInput';
import { EMOJIS } from '../constants';

interface ScenarioPageProps {
  onBack: () => void;
  onCorrect: () => void;
  score: number;
}

enum ScenarioMode {
  TYPE = 'TYPE',
  BUILD = 'BUILD',
}

interface Scenario {
  text: string;
  answer: number;
  emoji: string;
  mode: ScenarioMode;
}

const ScenarioPage: React.FC<ScenarioPageProps> = ({ onBack, onCorrect, score }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentBuildCount, setCurrentBuildCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const generateScenario = useCallback(() => {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const mode = Math.random() > 0.5 ? ScenarioMode.TYPE : ScenarioMode.BUILD;

    const templates = [
      (n1: number, n2: number) => ({
        text: `You have ${n1} ${emoji}. Your friend gives you ${n2} more. ${mode === ScenarioMode.TYPE ? 'How many do you have now?' : 'Can you build the total?'}`,
        answer: n1 + n2,
      }),
      (n1: number, n2: number) => ({
        text: `There are ${n1} ${emoji} in a jar. You eat ${n2}. ${mode === ScenarioMode.TYPE ? 'How many are left?' : 'Build the remaining amount.'}`,
        answer: n1 - n2,
      }),
      (n1: number, n2: number) => ({
        text: `A box holds ${n1} ${emoji}. You add ${n2} more. ${mode === ScenarioMode.TYPE ? 'What is the total?' : 'Show the new total by building it.'}`,
        answer: n1 + n2,
      }),
    ];

    const n1 = Math.floor(Math.random() * 5) + 4;
    const n2 = Math.floor(Math.random() * 3) + 1;
    const templateIdx = Math.floor(Math.random() * templates.length);
    const chosen = templates[templateIdx](n1, n2);

    setScenario({ ...chosen, emoji, mode });
    setUserAnswer('');
    setCurrentBuildCount(0);
    setIsCorrect(false);
  }, []);

  useEffect(() => {
    generateScenario();
  }, [generateScenario]);

  useEffect(() => {
    if (!scenario || isCorrect) {
      return;
    }

    let correct = false;
    if (scenario.mode === ScenarioMode.TYPE) {
      correct = userAnswer !== '' && parseInt(userAnswer, 10) === scenario.answer;
    } else {
      correct = currentBuildCount > 0 && currentBuildCount === scenario.answer;
    }

    if (correct) {
      setIsCorrect(true);
      onCorrect();
    }

    return undefined;
  }, [userAnswer, currentBuildCount, scenario, generateScenario, onCorrect, isCorrect]);

  useEffect(() => {
    if (!isCorrect) {
      return;
    }

    const timer = window.setTimeout(generateScenario, 1200);
    return () => window.clearTimeout(timer);
  }, [isCorrect, generateScenario]);

  const handleAddOne = () => {
    if (!isCorrect && currentBuildCount < 20) {
      setCurrentBuildCount((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    if (!isCorrect) {
      setCurrentBuildCount(0);
    }
  };

  if (!scenario) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative min-h-screen pb-40">
      <div className="fixed top-8 left-8 right-8 flex justify-between items-center z-50">
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest opacity-70">Stars</p>
          <p className="text-xl font-display">⭐ {score}</p>
        </div>
      </div>

      <header className="max-w-3xl w-full text-center mb-12">
        <h2 className="text-xs uppercase tracking-[0.4em] font-light mb-8 opacity-70">Scenario Question</h2>
        <p className="text-3xl md:text-5xl font-light font-display leading-tight transition-all duration-300">{scenario.text}</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-12">
        {scenario.mode === ScenarioMode.TYPE ? (
          <div className="w-full max-w-sm">
            <NumericInput value={userAnswer} onChange={setUserAnswer} label="Type The Answer" autoFocus />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl md:text-8xl font-display font-light text-white/90">{currentBuildCount}</div>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Tap the button below to add items</p>
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70">Visualization</h3>
          <EmojiGroup
            emoji={scenario.emoji}
            count={scenario.mode === ScenarioMode.TYPE ? parseInt(userAnswer, 10) || 0 : currentBuildCount}
            className={`w-full max-w-lg min-h-[160px] flex items-center justify-center transition-all duration-500 ${isCorrect ? 'border-amber-100 bg-amber-100/20' : ''}`}
          />
        </div>

        {scenario.mode === ScenarioMode.BUILD && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/40 shadow-2xl z-40">
            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full border border-white/40 hover:border-white transition-all duration-300 flex items-center justify-center group"
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
      </main>

      {isCorrect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100] animate-in zoom-in duration-300">
          <div className="bg-[#5a3e2b]/60 backdrop-blur-md w-full h-full flex items-center justify-center">
            <div className="text-amber-100 font-display text-7xl md:text-9xl uppercase tracking-[0.5em] animate-bounce">Great!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPage;
