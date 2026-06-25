import { LetterState, KeyState, GridState, GameStatus } from "./types";

export const ANCHOR_DATE = "2025-01-01";

export function normalize(word: string): string {
  return (
    word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      // Treat Ç as C
      .replace(/Ç/g, "C")
  );
}

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const normGuess = normalize(guess);
  const normAnswer = normalize(answer);
  const len = normAnswer.length;

  if (normGuess.length !== len) {
    return Array(len).fill("empty");
  }

  const result: LetterState[] = Array(len).fill("absent");
  const answerLetterCount: Record<string, number> = {};

  // Pass 1: Mark correct letters
  for (let i = 0; i < len; i++) {
    const char = normAnswer[i];
    if (normGuess[i] === char) {
      result[i] = "correct";
    } else {
      answerLetterCount[char] = (answerLetterCount[char] || 0) + 1;
    }
  }

  // Pass 2: Mark present letters
  for (let i = 0; i < len; i++) {
    if (result[i] === "correct") continue;

    const char = normGuess[i];
    if (answerLetterCount[char] > 0) {
      result[i] = "present";
      answerLetterCount[char]--;
    }
  }

  return result;
}

export function getDailyIndex(date: Date, totalWords: number): number {
  const anchor = new Date(ANCHOR_DATE);
  anchor.setHours(0, 0, 0, 0);
  const now = new Date(date);
  now.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now.getTime() - anchor.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays % totalWords;
}

export function aggregateKeyStates(
  grids: GridState[],
  isDezena: boolean = false,
): Record<string, KeyState[]> {
  const numGrids = grids.length;
  const keyStatusByGrid: Record<string, KeyState[]> = {};

  grids.forEach((grid, gridIdx) => {
    for (let guessIdx = 0; guessIdx < grid.guesses.length; guessIdx++) {
      const guess = grid.guesses[guessIdx];
      const evals = grid.evaluations[guessIdx];
      const len = guess.length;

      for (let i = 0; i < len; i++) {
        const char = guess[i];
        const currentEval = evals[i];

        if (!keyStatusByGrid[char]) {
          keyStatusByGrid[char] = Array(numGrids).fill("empty");
        }

        const existing = keyStatusByGrid[char][gridIdx];

        if (currentEval === "correct") {
          keyStatusByGrid[char][gridIdx] = "correct";
        } else if (currentEval === "present" && existing !== "correct") {
          keyStatusByGrid[char][gridIdx] = "present";
        } else if (currentEval === "absent" && existing === "empty") {
          keyStatusByGrid[char][gridIdx] = "absent";
        }
      }
    }
  });

  if (isDezena) {
    const collapsed: Record<string, KeyState[]> = {};
    for (const char in keyStatusByGrid) {
      const states = keyStatusByGrid[char];
      let best: KeyState = "empty";
      if (states.includes("correct")) best = "correct";
      else if (states.includes("present")) best = "present";
      else if (states.includes("absent")) best = "absent";
      collapsed[char] = [best];
    }
    return collapsed;
  }

  return keyStatusByGrid;
}

export function scoreContraRelogio(
  tentativasRestantes: number,
  segundosPassados: number,
): number {
  const base = 1000;
  const tentBonus = tentativasRestantes * 200;
  const timePenalty = segundosPassados * 10;
  return Math.max(0, base + tentBonus - timePenalty);
}
