const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface PlayerProgress {
  playerName: string;
  score: number;
  updatedAt: string | null;
}

const parseError = async (response: Response): Promise<string> => {
  try {
    const payload = await response.json();
    if (payload?.error) {
      return String(payload.error);
    }
  } catch {
    // Ignore JSON parse errors and fall back to HTTP status text.
  }

  return `Request failed (${response.status})`;
};

export const checkBackendHealth = async (): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return true;
};

export const getPlayerProgress = async (playerName: string): Promise<PlayerProgress> => {
  const response = await fetch(`${API_BASE_URL}/api/progress/${encodeURIComponent(playerName)}`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const savePlayerProgress = async (playerName: string, score: number): Promise<PlayerProgress> => {
  const response = await fetch(`${API_BASE_URL}/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playerName, score }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};
