/**
 * Storage layer
 *
 * - Watch history & settings → localStorage (persistent)
 * - API key → sessionStorage only (cleared when browser tab closes)
 *
 * All reads/writes are wrapped in try/catch so a corrupted entry
 * never crashes the app.
 */

import { STORAGE_KEYS, SESSION_KEYS } from '../config/constants';
import type { WatchEntry, AppSettings } from '../types';
import { TOPIC_MAP } from '../config/curriculum';

// ── Watch history ─────────────────────────────────────────────────

export function loadHistory(): WatchEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: WatchEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(history));
  } catch {
    console.warn('[storage] Failed to save history — localStorage may be full');
  }
}

export function upsertWatchEntry(
  history: WatchEntry[],
  topicId: string,
  patch: Partial<Omit<WatchEntry, 'topicId'>>,
): WatchEntry[] {
  const topic = TOPIC_MAP.get(topicId);
  if (!topic) return history;

  const existing = history.findIndex(e => e.topicId === topicId);
  const base: WatchEntry = existing >= 0
    ? history[existing]
    : {
        topicId,
        topicTitle: topic.title,
        category:   topic.category,
        level:      'beginner',
        watchedAt:  new Date().toISOString(),
        completed:  false,
      };

  const updated = { ...base, ...patch };

  if (existing >= 0) {
    return history.map((e, i) => i === existing ? updated : e);
  }
  return [...history, updated];
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
  } catch { /* silent */ }
}

// ── Settings ──────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  apiKey:       '',
  defaultLevel: 'beginner',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const saved = raw ? JSON.parse(raw) : {};
    // API key: sessionStorage > VITE env var > empty
    const apiKey =
      sessionStorage.getItem(SESSION_KEYS.API_KEY) ||
      (import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined) ||
      '';
    return { ...DEFAULT_SETTINGS, ...saved, apiKey };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Omit<AppSettings, 'apiKey'>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch { /* silent */ }
}

/** API key is kept ONLY in sessionStorage */
export function saveApiKey(key: string): void {
  try {
    if (key) sessionStorage.setItem(SESSION_KEYS.API_KEY, key);
    else      sessionStorage.removeItem(SESSION_KEYS.API_KEY);
  } catch { /* silent */ }
}

export function loadApiKey(): string {
  return sessionStorage.getItem(SESSION_KEYS.API_KEY) ?? '';
}
