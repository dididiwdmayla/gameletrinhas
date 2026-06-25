"use client";

import { useGame } from "../../../hooks/useGame";
import { useCountdown } from "../../../hooks/useCountdown";
import { GameMode, MODE_CONFIG } from "../../../lib/types";
import { BoardGrid } from "../../../components/BoardGrid";
import { Keyboard } from "../../../components/Keyboard";
import { Toast } from "../../../components/Toast";
import { ResultBanner } from "../../../components/ResultBanner";
import { Timer } from "../../../components/Timer";
import { StatsModal } from "../../../components/StatsModal";
import { SettingsModal } from "../../../components/SettingsModal";
import { useRouter } from "next/navigation";
import { use, useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../../hooks/use-mobile";

export default function GamePage({
  params,
}: {
  params: Promise<{ modo: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const modoStr = unwrappedParams.modo;

  const mode = (
    Object.keys(MODE_CONFIG).includes(modoStr as GameMode) ? modoStr : "solo"
  ) as GameMode;
  const config = MODE_CONFIG[mode];

  const game = useGame(mode);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // Timer logic
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const canHaveTimer = ["solo", "dueto", "quarteto"].includes(mode);
  const timerSeconds = mode === "solo" ? 60 : mode === "dueto" ? 120 : 180;
  const countdown = useCountdown(timerSeconds);

  // Start timer on first interaction
  useEffect(() => {
    if (
      isTimerEnabled &&
      game.status === "playing" &&
      game.currentAttemptChars.some((c) => c !== "")
    ) {
      countdown.start();
    }
  }, [isTimerEnabled, game.status, game.currentAttemptChars, countdown]);

  // Handle timer expiration
  useEffect(() => {
    if (isTimerEnabled && countdown.expired && game.status === "playing") {
      game.forceDefeat();
    }
  }, [isTimerEnabled, countdown.expired, game.status, game]);

  // Unica intro and wins
  const [unicaWins, setUnicaWins] = useState(0);
  const [showUnicaIntro, setShowUnicaIntro] = useState(false);
  const [hideUnicaWarning, setHideUnicaWarning] = useState(false);
  const [unicaCooldownMs, setUnicaCooldownMs] = useState(0);

  useEffect(() => {
    if (mode === "unica") {
      let wins = 0;
      try {
        wins = parseInt(localStorage.getItem("pentagono:unica:wins") || "0", 10);
      } catch (e) {}
      setUnicaWins(wins);

      let hideWarning = false;
      try {
        hideWarning = localStorage.getItem("letrinha:unica:hideWarning") === "true";
      } catch (e) {}
      setHideUnicaWarning(hideWarning);

      // Check cooldown
      let lastAttempt = null;
      let backupAttempt = null;
      try {
        lastAttempt = localStorage.getItem("letrinha:unica:lastAttempt");
        backupAttempt = localStorage.getItem("letrinha:unica:backupAttempt");
      } catch (e) {}

      if (lastAttempt || backupAttempt) {
        // if either exists, consider it active
        const timestamp = parseInt(lastAttempt || backupAttempt || "0", 10);
        const elapsed = Date.now() - timestamp;
        const cooldownMs = 60 * 60 * 1000; // 1 hour
        if (elapsed < cooldownMs) {
          setUnicaCooldownMs(cooldownMs - elapsed);
          // start local interval to count down
        } else if (!hideWarning) {
          setShowUnicaIntro(true);
        }
      } else if (!hideWarning) {
        setShowUnicaIntro(true);
      }
    }
  }, [mode]);

  useEffect(() => {
    if (unicaCooldownMs > 0) {
      const int = setInterval(() => {
        setUnicaCooldownMs((prev) => {
          if (prev <= 1000) {
            clearInterval(int);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(int);
    }
  }, [unicaCooldownMs]);

  useEffect(() => {
    if (mode === "unica" && game.status === "won") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnicaWins((prev) => {
        const newWins = prev + 1;
        localStorage.setItem("pentagono:unica:wins", newWins.toString());
        return newWins;
      });
    }
  }, [game.status, mode]);

  useEffect(() => {
    if (!Object.keys(MODE_CONFIG).includes(modoStr as GameMode)) {
      router.replace("/");
    }
  }, [modoStr, router]);

  const { width, height } = useWindowSize();
  const isFinished = game.status === "won" || game.status === "lost";

  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(" "); // Keep a space so backspace is registered on mobile

  if (!game.isLoaded) {
    return <div className="min-h-screen bg-bg-base" />;
  }

  const headerHeightClass = "h-14 sm:h-16";

  const hasStartedTyping =
    game.grids.some((g) => g.guesses.length > 0) ||
    game.currentAttemptChars.some((c) => c !== "");

  const toggleTimer = () => {
    if (!hasStartedTyping) {
      setIsTimerEnabled(!isTimerEnabled);
    }
  };

  const handleContainerClick = () => {
    if (isMobile && !isFinished && !showUnicaIntro) {
      inputRef.current?.focus();
    }
  };

  const handleNativeInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      game.handleEnter();
    } else if (e.key === "ArrowLeft") {
      game.handleArrowLeft();
    } else if (e.key === "ArrowRight") {
      game.handleArrowRight();
    }
    // Backspace logic is handled in onChange for mobile reliability
  };

  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < inputValue.length) {
      // Deletion occurred
      game.handleBackspace();
    } else if (val.length > inputValue.length) {
      // Addition occurred
      const char = val.charAt(val.length - 1).toUpperCase();
      const normalizedKey = char === "Ç" ? "C" : char;
      if (/^[A-Z]$/.test(normalizedKey)) {
        game.handleChar(normalizedKey);
      }
    }
    setInputValue(" "); // Always reset to a single space
  };

  const isErrorFlash = isTimerEnabled && game.wrongGuessShake;
  const isTimerCritical =
    isTimerEnabled &&
    countdown.remainingMs > 0 &&
    countdown.remainingMs <= 10000;

  return (
    <div
      className={`h-[100dvh] flex flex-col bg-bg-base overflow-hidden relative ${isErrorFlash ? "error-flash-overlay" : ""} ${game.wrongGuessShake ? "animate-shake" : ""}`}
    >
      {/* Invisible input for native keyboard on mobile */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        value={inputValue}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        onChange={handleNativeInputChange}
        onKeyDown={handleNativeInputKeyDown}
        className="absolute top-0 left-0 opacity-0 w-0 h-0 p-0 m-0 border-0 focus:ring-0 z-[-1]"
        aria-hidden="true"
      />
      {mode === "unica" && game.status === "won" && (
        <Confetti
          width={width}
          height={height}
          colors={["#ffffff", "#538d4e", "#b59f3b"]}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {showUnicaIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-base/90 p-4">
          <div className="bg-bg-surface p-8 rounded-xl max-w-sm text-center border-2 border-accent">
            <h2 className="text-3xl font-display font-black text-accent mb-4">
              ÚNICA
            </h2>
            <p className="text-text-primary mb-6">
              Ninguém acerta de primeira. Mas e se hoje for você? É 1 tentativa.
              1 palavra de 5 letras sorteada do zero, sem dicas prévias.
            </p>
            {unicaWins > 0 && (
              <p className="text-correct font-bold mb-6">
                Você já fez o impossível {unicaWins} vez(es)!
              </p>
            )}
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-text-muted">
              <input
                type="checkbox"
                id="hideWarningCheckbox"
                checked={hideUnicaWarning}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setHideUnicaWarning(checked);
                  try {
                    localStorage.setItem(
                      "letrinha:unica:hideWarning",
                      checked ? "true" : "false",
                    );
                  } catch (err) {}
                }}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="hideWarningCheckbox">
                Não mostrar este aviso novamente
              </label>
            </div>
            <button
              onClick={() => setShowUnicaIntro(false)}
              className="bg-accent text-bg-base font-bold py-2 px-6 rounded hover:opacity-90 transition-opacity"
            >
              ACEITO O DESAFIO
            </button>
          </div>
        </div>
      )}

      <header
        className={`w-full ${headerHeightClass} border-b border-absent flex items-center px-4 justify-between shrink-0 relative z-10`}
      >
        <button
          onClick={() => router.push("/")}
          className="text-text-muted hover:text-text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-display font-bold text-xl tracking-wide">
            {config.label.toUpperCase()}
          </h1>
          {isTimerEnabled && !isFinished && (
            <Timer
              remainingMs={countdown.remainingMs}
              pulse={isTimerCritical}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode !== "diario" && (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="text-text-muted hover:text-text-primary p-2"
              aria-label="Reiniciar Partida"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          )}
          {canHaveTimer && !hasStartedTyping && (
            <button
              onClick={toggleTimer}
              className={`p-2 transition-colors ${isTimerEnabled ? "text-accent" : "text-text-muted hover:text-text-primary"}`}
              aria-label="Toggle Cronômetro"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
          )}
          {mode !== "unica" && (
            <button
              onClick={() => setShowStats(true)}
              className="text-text-muted hover:text-text-primary p-2"
              aria-label="Estatísticas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {showRestartConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-base/80 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-surface p-6 rounded-xl max-w-sm w-full border border-absent shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-3">Reiniciar Partida?</h2>
            <p className="text-text-muted mb-6">
              A palavra atual será trocada por uma nova e o progresso da partida
              será perdido. Tem certeza?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-4 py-2 text-text-muted hover:text-text-primary transition-colors font-bold"
              >
                CANCELAR
              </button>
              <button
                onClick={() => {
                  setShowRestartConfirm(false);
                  game.restartGame();
                  if (isTimerEnabled) countdown.reset();
                }}
                className="px-4 py-2 bg-accent text-bg-base rounded font-bold hover:opacity-90 transition-opacity"
              >
                REINICIAR
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Toast message={game.toastMsg} />

      <main className="flex-1 flex flex-col items-center w-full min-h-0 relative z-10">
        <div className="flex-1 w-full flex flex-col pt-4 overflow-hidden">
          <BoardGrid
            grids={game.grids}
            currentAttemptChars={game.currentAttemptChars}
            cursorIndex={game.cursorIndex}
            onCellClick={(idx) => {
              game.handleCellClick(idx);
              handleContainerClick();
            }}
            maxAttempts={config.maxAttempts}
            invalidShake={game.invalidShake}
            letras={config.letras}
          />
        </div>

        <div className="w-full shrink-0 z-20 bg-bg-base pb-2 sm:pb-4">
          <Keyboard
            onChar={(key) => {
              inputRef.current?.blur();
              game.handleChar(key);
            }}
            onBackspace={() => {
              inputRef.current?.blur();
              game.handleBackspace();
            }}
            onEnter={() => {
              inputRef.current?.blur();
              game.handleEnter();
            }}
            onArrowLeft={() => {
              inputRef.current?.blur();
              game.handleArrowLeft();
            }}
            onArrowRight={() => {
              inputRef.current?.blur();
              game.handleArrowRight();
            }}
            keyStates={game.keyStates}
          />
        </div>
      </main>

      {isFinished && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm">
          {mode === "unica" ? (
            <div className="bg-bg-surface p-8 rounded-xl max-w-sm text-center border-2 border-text-muted">
              <h2
                className={`text-4xl font-display font-black mb-4 ${game.status === "won" ? "text-correct" : "text-accent"}`}
              >
                {game.status === "won"
                  ? "VOCÊ ACERTOU. ISSO NÃO ERA PRA ACONTECER."
                  : "Era essa. Claro que era."}
              </h2>
              <div className="flex justify-center gap-2 mb-8">
                {game.grids[0].answer.split("").map((char, i) => (
                  <span
                    key={i}
                    className="bg-bg-base w-10 h-10 flex items-center justify-center rounded font-bold text-xl uppercase border border-absent"
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowUnicaIntro(true);
                    game.restartGame();
                  }}
                  className="w-full bg-text-primary text-bg-base font-bold py-3 px-8 rounded hover:opacity-90 transition-opacity"
                >
                  TENTAR OUTRA
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-bg-base border-2 border-text-muted/30 text-text-muted font-bold py-3 px-8 rounded hover:opacity-90 transition-opacity"
                >
                  VOLTAR AO MENU
                </button>
              </div>
            </div>
          ) : (
            <ResultBanner
              status={game.status as "won" | "lost"}
              mode={mode}
              score={0}
              answers={game.grids.map((g) => g.answer)}
              onPlayAgain={() => {
                countdown.reset();
                game.restartGame();
              }}
              onMenu={() => router.push("/")}
            />
          )}
        </div>
      )}

      <AnimatePresence>
        {showStats && (
          <StatsModal onClose={() => setShowStats(false)} initialMode={mode} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  );
}
