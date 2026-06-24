import { Stats, GameMode, GridState } from "./types";

const PREFIX = "pentagono";

export function loadStats(mode: GameMode): Stats {
  const defaultStats: Stats = {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: {},
  };

  if (typeof window === "undefined") return defaultStats;

  try {
    const data = localStorage.getItem(`${PREFIX}:stats:${mode}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load stats", e);
  }
  return defaultStats;
}

export function saveStats(mode: GameMode, stats: Stats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREFIX}:stats:${mode}`, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save stats", e);
  }
}

export function loadGameState(
  mode: GameMode,
  suffix: string = "",
): GridState[] | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `${PREFIX}:state:${mode}${suffix ? ":" + suffix : ""}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load game state", e);
  }
  return null;
}

export function saveGameState(
  mode: GameMode,
  state: GridState[] | null,
  suffix: string = "",
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${PREFIX}:state:${mode}${suffix ? ":" + suffix : ""}`;
    if (!state) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(state));
    }
  } catch (e) {
    console.error("Failed to save game state", e);
  }
}

export function loadPrefs(): { highContrast: boolean; reducedMotion: boolean } {
  const defaultPrefs = { highContrast: false, reducedMotion: false };
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const data = localStorage.getItem(`${PREFIX}:prefs`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }
  return defaultPrefs;
}

export function savePrefs(prefs: {
  highContrast: boolean;
  reducedMotion: boolean;
}): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREFIX}:prefs`, JSON.stringify(prefs));
  } catch (e) {
    // ignore
  }
}

export function hasPlayedDaily(dateStr: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${PREFIX}:daily_played:${dateStr}`) === "true";
  } catch (e) {
    return false;
  }
}

export function markDailyPlayed(dateStr: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREFIX}:daily_played:${dateStr}`, "true");
  } catch (e) {
    // ignore
  }
}
