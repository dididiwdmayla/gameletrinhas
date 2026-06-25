export interface ModeConfig {
  grids: number;
  maxAttempts: number;
  label: string;
  infinite: boolean;
  letras: number;
}

export type LetterState = "empty" | "tabbed" | "correct" | "present" | "absent";
export type KeyState = "empty" | "correct" | "present" | "absent";
export type GameMode =
  | "solo"
  | "dueto"
  | "quarteto"
  | "sextuplo"
  | "dezena"
  | "unica"
  | "diario";
export type GameStatus = "playing" | "won" | "lost";

export interface GridState {
  id: number;
  guesses: string[];
  evaluations: LetterState[][];
  status: GameStatus;
  answer: string;
}

export interface Stats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: Record<number, number>;
}

export const MODE_CONFIG: Record<GameMode, ModeConfig> = {
  solo: { grids: 1, maxAttempts: 6, label: "Solo", infinite: false, letras: 5 },
  dueto: {
    grids: 2,
    maxAttempts: 7,
    label: "Dueto",
    infinite: false,
    letras: 5,
  },
  quarteto: {
    grids: 4,
    maxAttempts: 9,
    label: "Quarteto",
    infinite: false,
    letras: 5,
  },
  sextuplo: {
    grids: 6,
    maxAttempts: 11,
    label: "Sêxtuplo",
    infinite: false,
    letras: 5,
  },
  dezena: {
    grids: 10,
    maxAttempts: 16,
    label: "Dezena",
    infinite: false,
    letras: 5,
  },
  unica: {
    grids: 1,
    maxAttempts: 1,
    label: "Única",
    infinite: false,
    letras: 5,
  },
  diario: {
    grids: 1,
    maxAttempts: 6,
    label: "Diário",
    infinite: false,
    letras: 5,
  },
};
