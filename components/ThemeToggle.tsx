"use client";

import { MoonStars, Sun } from "@phosphor-icons/react";

export const TEMA_KEY = "makanangin:tema";

/** Light is the default; the choice is remembered per browser. The attribute
 *  on <html> is the single source of truth, set before first paint by the
 *  inline script in layout.tsx, so this button holds no React state: CSS
 *  picks the icon off that same attribute. No state means no hydration
 *  mismatch and no wrong-icon flash. The label stays state-independent so
 *  there is exactly one accessible name either way.
 *
 *  taste-skill lists the sun/moon switch as a cliche, but the toggle was
 *  asked for explicitly, so this is a plain icon button rather than the
 *  sliding switch that rule is actually aimed at. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  function ganti() {
    const el = document.documentElement;
    const next = el.dataset.theme === "dark" ? "light" : "dark";
    el.dataset.theme = next;
    try {
      localStorage.setItem(TEMA_KEY, next);
    } catch {
      // private mode or storage blocked: the theme still applies for this page
    }
  }

  return (
    <button
      type="button"
      onClick={ganti}
      aria-label="Ganti tema terang atau gelap"
      title="Ganti tema"
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:bg-surface hover:text-ink ${className}`}
    >
      <MoonStars size={18} weight="bold" aria-hidden className="only-light" />
      <Sun size={18} weight="bold" aria-hidden className="only-dark" />
    </button>
  );
}
