import { useState, useEffect, useCallback } from "react";
import { GameMode, GameStatus, GridState, MODE_CONFIG } from "../lib/types";
import {
  evaluateGuess,
  aggregateKeyStates,
  getDailyIndex,
} from "../lib/engine";
import { ANSWERS } from "../lib/words";
import { isValidGuess } from "../lib/dictionary";
import {
  saveGameState,
  loadGameState,
  hasPlayedDaily,
  markDailyPlayed,
  saveStats,
  loadStats,
} from "../lib/storage";
import { ANSWERS_11 } from "../lib/words11";
import { isValidGuess11 } from "../lib/dictionary11";

export function useGame(mode: GameMode) {
  const config = MODE_CONFIG[mode];

  const [grids, setGrids] = useState<GridState[]>([]);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [invalidShake, setInvalidShake] = useState(false);
  const [wrongGuessShake, setWrongGuessShake] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cursor selection logic
  const [guessChars, setGuessChars] = useState<string[]>(
    Array(config.letras).fill(""),
  );
  const [cursorIndex, setCursorIndex] = useState(0);

  // Determine Daily suffix to isolate state per day
  const todayStr = new Date().toISOString().split("T")[0];
  const stateSuffix = mode === "diario" ? todayStr : "";

  const getAnswersForMode = useCallback(
    (numGrids: number) => {
      if (mode === "diario") {
        const idx = getDailyIndex(new Date(), ANSWERS.length);
        return [ANSWERS[idx]];
      }

      const sourceAnswers = mode === "onze" ? ANSWERS_11 : ANSWERS;

      if (mode === "unica") {
        const randomIdx = Math.floor(Math.random() * sourceAnswers.length);
        return [sourceAnswers[randomIdx]];
      }

      // Random selection without replacement
      const used = new Set<string>(); // don't track used across page reloads for simple modes
      let available = sourceAnswers.filter((ans) => !used.has(ans));
      if (available.length < numGrids) {
        // if we somehow run out, just reset available
        available = [...sourceAnswers];
      }

      const shuffled = available.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numGrids);
    },
    [mode],
  );

  const initGame = useCallback(
    (forceNew = false) => {
      if (mode === "unica") forceNew = true;

      let savedState = null;
      if (!forceNew) {
        savedState = loadGameState(mode, stateSuffix);
      }

      if (savedState && savedState.length > 0) {
        setGrids(savedState);
        // Determine overall status from loaded grids
        const allWon = savedState.every((g: GridState) => g.status === "won");
        const anyLost = savedState.some((g: GridState) => g.status === "lost");
        if (anyLost) setStatus("lost");
        else if (allWon) setStatus("won");
        else setStatus("playing");
      } else {
        const answers = getAnswersForMode(config.grids);
        const initialGrids: GridState[] = Array(config.grids)
          .fill(null)
          .map((_, i) => ({
            id: i,
            guesses: [],
            evaluations: [],
            status: "playing",
            answer: answers[i],
          }));
        setGrids(initialGrids);
        setStatus("playing");
      }
      setGuessChars(Array(config.letras).fill(""));
      setCursorIndex(0);
      setIsLoaded(true);
    },
    [mode, config.grids, config.letras, stateSuffix, getAnswersForMode],
  );

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) initGame();
    }, 0);
    return () => {
      active = false;
    };
  }, [initGame]);

  useEffect(() => {
    if (!isLoaded) return;
    if (mode !== "unica") {
      saveGameState(mode, grids, stateSuffix);
    }
  }, [grids, isLoaded, mode, stateSuffix]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleChar = useCallback(
    (char: string) => {
      if (status !== "playing") return;

      const newChars = [...guessChars];
      newChars[cursorIndex] = char.toUpperCase();
      setGuessChars(newChars);

      // Find next empty cell to the right
      let nextCursor = cursorIndex;
      let found = false;
      for (let i = cursorIndex + 1; i < config.letras; i++) {
        if (newChars[i] === "") {
          nextCursor = i;
          found = true;
          break;
        }
      }
      // If not found to the right, find to the left
      if (!found) {
        for (let i = 0; i < cursorIndex; i++) {
          if (newChars[i] === "") {
            nextCursor = i;
            found = true;
            break;
          }
        }
      }
      setCursorIndex(nextCursor);
    },
    [status, guessChars, cursorIndex, config.letras],
  );

  const handleBackspace = useCallback(() => {
    if (status !== "playing") return;

    const newChars = [...guessChars];
    if (newChars[cursorIndex] !== "") {
      newChars[cursorIndex] = "";
      setGuessChars(newChars);
    } else {
      if (cursorIndex > 0) {
        newChars[cursorIndex - 1] = "";
        setGuessChars(newChars);
        setCursorIndex(cursorIndex - 1);
      }
    }
  }, [status, guessChars, cursorIndex]);

  const handleArrowLeft = useCallback(() => {
    if (status !== "playing") return;
    setCursorIndex((prev) => Math.max(0, prev - 1));
  }, [status]);

  const handleArrowRight = useCallback(() => {
    if (status !== "playing") return;
    setCursorIndex((prev) => Math.min(config.letras - 1, prev + 1));
  }, [status, config.letras]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (status !== "playing") return;
      setCursorIndex(index);
    },
    [status],
  );

  const updateStats = useCallback(
    (finalResult: "won" | "lost", currentGrids: GridState[]) => {
      if (mode === "unica") return;

      // Mark daily as played
      if (mode === "diario") {
        markDailyPlayed(todayStr);
      }

      const stats = loadStats(mode);
      stats.played += 1;
      if (finalResult === "won") {
        stats.wins += 1;
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.maxStreak) {
          stats.maxStreak = stats.currentStreak;
        }
        // calculate attempts used
        const maxGuessesUsed = Math.max(
          ...currentGrids.map((g) => g.guesses.length),
        );
        stats.distribution[maxGuessesUsed] =
          (stats.distribution[maxGuessesUsed] || 0) + 1;
      } else {
        stats.currentStreak = 0;
      }
      saveStats(mode, stats);
    },
    [mode, todayStr],
  );

  const forceDefeat = useCallback(() => {
    setStatus("lost");
    setGrids((prev) => {
      const updated = prev.map((g) =>
        g.status === "playing" ? { ...g, status: "lost" as GameStatus } : g,
      );
      updateStats("lost", updated);
      return updated;
    });
  }, [updateStats]);

  const handleEnter = useCallback(() => {
    if (status !== "playing") return;
    const currentGuess = guessChars.join("");

    // Easter eggs check
    const currentTrimmed = currentGuess.replace(/\s/g, "");
    if (currentTrimmed === "YURI" || currentGuess === "DANTE") {
      const theme = currentTrimmed === "YURI" ? "gasolina" : "dourado";
      import("../lib/theme").then(({ unlockTheme, setCurrentTheme }) => {
        unlockTheme(theme);
        setCurrentTheme(theme);
      });
      showToast(
        `Tema secreto desbloqueado: ${theme === "dourado" ? "Dourado" : "Verde-Gasolina"}!`,
      );
      // Consume the letters visually by clearing them so user can keep playing
      setGuessChars(Array(config.letras).fill(""));
      setCursorIndex(0);
      return;
    }

    if (currentGuess.length !== config.letras) {
      setInvalidShake(true);
      setTimeout(() => setInvalidShake(false), 500);
      return;
    }

    const isValid = mode === "onze" ? isValidGuess11(currentGuess) : isValidGuess(currentGuess);

    if (!isValid) {
      showToast("Palavra não encontrada");
      setInvalidShake(true);
      setTimeout(() => setInvalidShake(false), 500);
      return;
    }

    let newGrids = grids.map((grid) => {
      if (grid.status !== "playing") return grid;

      const evalResult = evaluateGuess(currentGuess, grid.answer);
      const newGuesses = [...grid.guesses, currentGuess];
      const newEvals = [...grid.evaluations, evalResult];

      const isWin = evalResult.every((v) => v === "correct");
      const isLoss = !isWin && newGuesses.length >= config.maxAttempts;

      let newStatus: GameStatus = grid.status;
      if (isWin) {
        newStatus = "won";
      } else if (isLoss) {
        newStatus = "lost";
      }

      return {
        ...grid,
        guesses: newGuesses,
        evaluations: newEvals,
        status: newStatus,
      };
    });

    setGrids(newGrids);
    setGuessChars(Array(config.letras).fill(""));
    setCursorIndex(0);

    // Check global status
    const allWon = newGrids.every((g) => g.status === "won");
    const anyLost = newGrids.some((g) => g.status === "lost");

    if (anyLost) {
      setStatus("lost");
      updateStats("lost", newGrids);
      if (mode === "unica") {
        const now = Date.now().toString();
        localStorage.setItem("letrinha:unica:lastAttempt", now);
        localStorage.setItem("letrinha:unica:backupAttempt", now);
      }
    } else if (allWon) {
      setStatus("won");
      updateStats("won", newGrids);
      if (mode === "unica") {
        const now = Date.now().toString();
        localStorage.setItem("letrinha:unica:lastAttempt", now);
        localStorage.setItem("letrinha:unica:backupAttempt", now);
      }
    } else {
      // Valid guess but didn't resolve the game. Shake and flash
      setWrongGuessShake(true);
      setTimeout(() => setWrongGuessShake(false), 150);
    }
  }, [
    status,
    guessChars,
    grids,
    config.maxAttempts,
    config.letras,
    mode,
    updateStats,
  ]);

  const restartGame = () => {
    initGame(true);
  };

  const keyStates = aggregateKeyStates(grids, false);

  return {
    grids,
    currentAttemptChars: guessChars,
    cursorIndex,
    status,
    invalidShake,
    wrongGuessShake,
    toastMsg,
    handleChar,
    handleBackspace,
    handleEnter,
    handleArrowLeft,
    handleArrowRight,
    handleCellClick,
    restartGame,
    forceDefeat,
    isLoaded,
    keyStates,
  };
}
