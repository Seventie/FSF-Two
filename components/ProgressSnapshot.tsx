import React, { useEffect, useMemo, useState } from 'react';
import { SyncStatus } from '../types';

interface ProgressSnapshotProps {
  playerName: string;
  score: number;
  syncStatus: SyncStatus;
  backendOnline: boolean;
  lastSyncedAt: string | null;
}

const ProgressSnapshot: React.FC<ProgressSnapshotProps> = ({
  playerName,
  score,
  syncStatus,
  backendOnline,
  lastSyncedAt,
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!lastSyncedAt) {
      return;
    }

    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 1200);
    return () => window.clearTimeout(timer);
  }, [lastSyncedAt]);

  const statusText = useMemo(() => {
    if (!backendOnline) {
      return 'Backend Offline';
    }

    if (syncStatus === 'loading') {
      return 'Loading';
    }
    if (syncStatus === 'saving') {
      return 'Saving';
    }
    if (syncStatus === 'error') {
      return 'Sync Error';
    }
    return 'Synced';
  }, [backendOnline, syncStatus]);

  const lastSyncLabel = lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString() : 'Not synced yet';

  return (
    <div
      className={`rounded-2xl border border-white/40 px-4 py-3 transition-all ${pulse ? 'bg-amber-100/35 border-amber-100' : 'bg-white/20 backdrop-blur-sm'}`}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Player</p>
      <p className="text-lg font-display">{playerName || 'Guest'}</p>
      <p className="text-sm opacity-80">Stars: {score}</p>
      <p className="text-[10px] uppercase tracking-widest opacity-65 mt-2">{statusText}</p>
      <p className="text-[10px] opacity-50">Last Sync: {lastSyncLabel}</p>
    </div>
  );
};

export default ProgressSnapshot;
