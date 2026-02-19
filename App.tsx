import React, { useCallback, useEffect, useState } from 'react';
import SelectorPage from './pages/SelectorPage';
import ArithmeticPage from './pages/ArithmeticPage';
import CountingPage from './pages/CountingPage';
import ScenarioPage from './pages/ScenarioPage';
import ShapesPage from './pages/ShapesPage';
import ComparePage from './pages/ComparePage';
import FloatingStars from './components/FloatingStars';
import { Page, SyncStatus } from './types';
import { checkBackendHealth, getPlayerProgress, savePlayerProgress } from './services/progressApi';

const PLAYER_NAME_STORAGE_KEY = 'math-player-name';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SELECTOR);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  // Sync with hash for basic navigation.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (Object.values(Page).includes(hash as Page)) {
        setCurrentPage(hash as Page);
      } else {
        setCurrentPage(Page.SELECTOR);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const syncProfileFromBackend = useCallback(async (name: string) => {
    setSyncStatus('loading');
    setSyncError(null);
    try {
      const progress = await getPlayerProgress(name);
      setScore(progress.score);
      setLastSyncedAt(progress.updatedAt);
      setBackendOnline(true);
      setSyncStatus('idle');
    } catch (error) {
      setBackendOnline(false);
      setSyncStatus('error');
      const message = error instanceof Error ? error.message : 'Could not load profile from backend.';
      setSyncError(message);
      throw error;
    }
  }, []);

  const handleSavePlayerName = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return;
      }

      setPlayerName(trimmedName);
      localStorage.setItem(PLAYER_NAME_STORAGE_KEY, trimmedName);
      await syncProfileFromBackend(trimmedName);
      setProfileReady(true);
    },
    [syncProfileFromBackend]
  );

  // Check backend availability once at startup.
  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        await checkBackendHealth();
        if (isMounted) {
          setBackendOnline(true);
        }
      } catch {
        if (isMounted) {
          setBackendOnline(false);
        }
      }
    };

    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Restore cached player profile on first load.
  useEffect(() => {
    const savedName = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
    if (!savedName) {
      setProfileReady(true);
      return;
    }

    setPlayerName(savedName);
    syncProfileFromBackend(savedName)
      .catch(() => undefined)
      .finally(() => {
        setProfileReady(true);
      });
  }, [syncProfileFromBackend]);

  // Persist score changes for the selected player.
  useEffect(() => {
    if (!playerName || !profileReady) {
      return;
    }

    const timer = window.setTimeout(async () => {
      setSyncStatus('saving');
      setSyncError(null);
      try {
        const progress = await savePlayerProgress(playerName, score);
        setLastSyncedAt(progress.updatedAt);
        setBackendOnline(true);
        setSyncStatus('idle');
      } catch (error) {
        setBackendOnline(false);
        setSyncStatus('error');
        const message = error instanceof Error ? error.message : 'Could not save score.';
        setSyncError(message);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [playerName, profileReady, score]);

  const navigateTo = (page: Page) => {
    window.location.hash = page;
  };

  const addScore = () => setScore((prev) => prev + 1);

  const renderPage = () => {
    const commonProps = { onBack: () => navigateTo(Page.SELECTOR), onCorrect: addScore, score };
    switch (currentPage) {
      case Page.SELECTOR:
        return (
          <SelectorPage
            onSelect={navigateTo}
            score={score}
            playerName={playerName}
            onSavePlayerName={handleSavePlayerName}
            syncStatus={syncStatus}
            backendOnline={backendOnline}
            lastSyncedAt={lastSyncedAt}
            syncError={syncError}
          />
        );
      case Page.ARITHMETIC:
        return <ArithmeticPage {...commonProps} />;
      case Page.COUNTING:
        return <CountingPage {...commonProps} />;
      case Page.SCENARIOS:
        return <ScenarioPage {...commonProps} />;
      case Page.SHAPES:
        return <ShapesPage {...commonProps} />;
      case Page.COMPARE:
        return <ComparePage {...commonProps} />;
      default:
        return (
          <SelectorPage
            onSelect={navigateTo}
            score={score}
            playerName={playerName}
            onSavePlayerName={handleSavePlayerName}
            syncStatus={syncStatus}
            backendOnline={backendOnline}
            lastSyncedAt={lastSyncedAt}
            syncError={syncError}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <FloatingStars />
      <div className="relative z-10">{renderPage()}</div>
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12 opacity-75">
        <div className="border-t border-white/35 pt-8 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]">
          <div>(c) 2026 Education</div>
          <div>Minimal Learning</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
