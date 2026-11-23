// Saves the profile and progress in this browser only (localStorage).
// It can be empty or blocked (private windows, cleared data), so every
// access is wrapped and the app works without it.

import { useSyncExternalStore } from "react";
import type { Situation } from "./situation.ts";

const KEY = "taupefr:v1";

export type Saved = { situation: Situation; done: string[] };

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseSaved(raw: string | null): Saved | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Saved>;
    if (!data || typeof data !== "object" || !data.situation) return null;
    return {
      situation: data.situation,
      done: Array.isArray(data.done) ? data.done : [],
    };
  } catch {
    return null;
  }
}

export function save(data: Saved) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable: the app keeps working for this visit.
  }
  notify();
}

export function clearSaved() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The raw saved string (stable between renders); null on the server. */
export function useSavedRaw(): string | null {
  return useSyncExternalStore(subscribe, readRaw, () => null);
}
