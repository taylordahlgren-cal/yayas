"use client";
import { createContext, useContext, useEffect, useState } from "react";

const DogModeContext = createContext({ dog: false, toggle: () => {} });

export function DogModeProvider({ children }) {
  const [dog, setDog] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { setDog(localStorage.getItem("yayas-dog-mode") === "1"); } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dog", dog);
    if (!loaded) return; // don't overwrite the saved setting before we've read it
    try { localStorage.setItem("yayas-dog-mode", dog ? "1" : "0"); } catch {}
  }, [dog, loaded]);
  return <DogModeContext.Provider value={{ dog, toggle: () => setDog((d) => !d) }}>{children}</DogModeContext.Provider>;
}

export const useDogMode = () => useContext(DogModeContext);

// Scattered emojis in the background, only in Dog Mode.
const DECOR = ["🐾", "🦴", "🐕", "💩", "🐾", "🎾", "🐶", "🐾", "💩", "🦴", "🐩", "🐾"];
export function DogDecor() {
  const { dog } = useDogMode();
  if (!dog) return null;
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {DECOR.map((e, i) => (
        <span key={i} className="absolute text-4xl dog-float"
          style={{ left: `${(i * 37) % 95}%`, top: `${(i * 53 + 10) % 90}%`, animationDelay: `${i * 0.7}s`, opacity: 0.18 }}>{e}</span>
      ))}
    </div>
  );
}
