export type ThemeName = "default" | "dourado" | "gasolina";

export function getUnlockedThemes(): ThemeName[] {
  if (typeof window === "undefined") return ["default"];
  const stored = localStorage.getItem("letrinha:themes:unlocked");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return ["default"];
    }
  }
  return ["default"];
}

export function unlockTheme(theme: ThemeName) {
  if (typeof window === "undefined") return;
  const unlocked = new Set(getUnlockedThemes());
  unlocked.add(theme);
  localStorage.setItem(
    "letrinha:themes:unlocked",
    JSON.stringify(Array.from(unlocked)),
  );
}

export function getCurrentTheme(): ThemeName {
  if (typeof window === "undefined") return "default";
  const theme = localStorage.getItem("letrinha:theme") as ThemeName;
  return theme || "default";
}

export function setCurrentTheme(theme: ThemeName) {
  if (typeof window === "undefined") return;
  localStorage.setItem("letrinha:theme", theme);
  document.documentElement.setAttribute(
    "data-theme",
    theme === "default" ? "" : theme,
  );
}

export function initializeTheme() {
  setCurrentTheme(getCurrentTheme());
}
