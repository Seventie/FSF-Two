import React, { useEffect, useState } from 'react';
import ProgressSnapshot from '../components/ProgressSnapshot';
import { Page, SyncStatus } from '../types';

interface SelectorPageProps {
  onSelect: (page: Page) => void;
  score: number;
  playerName: string;
  onSavePlayerName: (playerName: string) => Promise<void>;
  syncStatus: SyncStatus;
  backendOnline: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
}

const SelectorPage: React.FC<SelectorPageProps> = ({
  onSelect,
  score,
  playerName,
  onSavePlayerName,
  syncStatus,
  backendOnline,
  lastSyncedAt,
  syncError,
}) => {
  const [nameInput, setNameInput] = useState(playerName);
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNameInput(playerName);
  }, [playerName]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();

    if (!trimmedName) {
      setFormMessage('Please enter a player name first.');
      return;
    }

    setIsSubmitting(true);
    setFormMessage('');
    try {
      await onSavePlayerName(trimmedName);
      setFormMessage('Player profile synced successfully.');
    } catch {
      setFormMessage('Using local mode for now. Backend sync failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 w-full">
      <header className="mb-16 flex flex-col md:flex-row justify-between gap-8 md:items-end">
        <div>
          <h1 className="text-xs uppercase tracking-[0.4em] font-light mb-4 opacity-75">Math Utility // For Kids</h1>
          <p className="text-5xl md:text-7xl font-light tracking-tight leading-none max-w-xl font-display">
            Play 🙂 Learn 🌟 <br />
            Grow 🤎
          </p>
        </div>
        <ProgressSnapshot
          playerName={playerName}
          score={score}
          syncStatus={syncStatus}
          backendOnline={backendOnline}
          lastSyncedAt={lastSyncedAt}
        />
      </header>

      <section className="mb-14 border border-white/40 rounded-2xl p-5 md:p-6 bg-white/20 backdrop-blur-sm">
        <form className="flex flex-col md:flex-row gap-4 md:items-end" onSubmit={handleSubmit}>
          <div className="flex-1">
            <label htmlFor="player-name" className="text-[10px] uppercase tracking-[0.2em] text-white/85 font-bold block mb-2">
              Player Name
            </label>
            <input
              id="player-name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Enter child name"
              className="w-full bg-white/20 border border-white/40 rounded-xl px-4 py-3 outline-none focus:border-amber-100"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[50px] rounded-xl px-6 border border-white/50 bg-amber-100/35 hover:bg-amber-100/55 disabled:opacity-40 disabled:pointer-events-none text-xs uppercase tracking-[0.2em]"
          >
            {isSubmitting ? 'Syncing...' : 'Save Profile'}
          </button>
        </form>

        {formMessage && <p className="text-xs opacity-65 mt-3">{formMessage}</p>}
        {syncError && <p className="text-xs text-red-200 mt-1">{syncError}</p>}
      </section>

      <main className="space-y-24">
        <GameOptionCard
          index="01"
          title="Addition & Subtraction"
          subtitle="Basic Arithmetic Operations"
          onClick={() => onSelect(Page.ARITHMETIC)}
        />
        <GameOptionCard
          index="02"
          title="Counting 1-10"
          subtitle="Number Recognition"
          onClick={() => onSelect(Page.COUNTING)}
        />
        <GameOptionCard
          index="03"
          title="Scenario Logic"
          subtitle="Word Problems & Visualizing"
          onClick={() => onSelect(Page.SCENARIOS)}
        />
        <GameOptionCard
          index="04"
          title="Shapes with Emojis"
          subtitle="Triangle, Rectangle, Square"
          onClick={() => onSelect(Page.SHAPES)}
        />
        <GameOptionCard
          index="05"
          title="Which Side Has More?"
          subtitle="Compare two emoji groups"
          onClick={() => onSelect(Page.COMPARE)}
        />
      </main>
    </div>
  );
};

const GameOptionCard: React.FC<{ index: string; title: string; subtitle: string; onClick: () => void }> = ({
  index,
  title,
  subtitle,
  onClick,
}) => (
  <section className="group cursor-pointer border-t border-white/30 pt-8" onClick={onClick}>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 font-display">
          {index}. {title}
        </h2>
        <p className="text-xs uppercase tracking-widest opacity-80">{subtitle}</p>
      </div>
      <div className="w-full md:w-48 relative border-b border-white/40 group-hover:border-amber-100 transition-colors duration-300">
        <button className="absolute right-0 bottom-4 text-sm uppercase tracking-widest font-bold text-white hover:text-amber-100 transition-colors flex items-center gap-2">
          Play <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  </section>
);

export default SelectorPage;
