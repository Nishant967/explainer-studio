/**
 * Global app store — Zustand
 *
 * Single source of truth for:
 *  - settings (apiKey, defaultLevel)
 *  - watch history
 *  - current generation state
 *
 * All persistence goes through the storage lib, not directly from components.
 */

import { create } from 'zustand';
import type {
  AppSettings,
  WatchEntry,
  VideoScript,
  GenerationStatus,
  DifficultyLevel,
  CurriculumTopic,
} from '../types';
import {
  loadHistory, saveHistory, upsertWatchEntry,
  loadSettings, saveSettings, saveApiKey,
} from '../lib/storage';
import { generateScript, isValidApiKey } from '../services/claude';
import { pickDailyTopic, recommendNext, curriculumStats } from '../lib/scheduler';

// ── State shape ───────────────────────────────────────────────────

interface AppStore {
  // Settings
  settings:      AppSettings;
  setApiKey:     (key: string) => void;
  setLevel:      (level: DifficultyLevel) => void;

  // Watch history
  history:       WatchEntry[];
  markCompleted: (topicId: string) => void;
  clearHistory:  () => void;

  // Daily topic
  dailyTopic:    CurriculumTopic | null;
  repickTopic:   () => void;

  // Generation
  status:        GenerationStatus;
  errorMessage:  string | null;
  currentScript: VideoScript | null;
  activeScene:   number;
  generate:      () => Promise<void>;
  setActiveScene:(idx: number) => void;

  // Derived (computed on read — no need to store)
  stats: () => ReturnType<typeof curriculumStats>;
}

// ── Store ─────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => {
  // Hydrate from storage on creation
  const history  = loadHistory();
  const settings = loadSettings();
  const daily    = pickDailyTopic(history);

  return {
    // ── Settings ──────────────────────────────────────────────────
    settings,

    setApiKey(key) {
      saveApiKey(key);
      set(s => ({ settings: { ...s.settings, apiKey: key } }));
    },

    setLevel(level) {
      const updated = { ...get().settings, defaultLevel: level };
      saveSettings({ defaultLevel: level });
      set({ settings: updated });
    },

    // ── History ───────────────────────────────────────────────────
    history,

    markCompleted(topicId) {
      const updated = upsertWatchEntry(get().history, topicId, {
        completed: true,
        watchedAt: new Date().toISOString(),
        level:     get().settings.defaultLevel,
      });
      saveHistory(updated);
      set({ history: updated });
    },

    clearHistory() {
      saveHistory([]);
      set({ history: [], dailyTopic: pickDailyTopic([]) });
    },

    // ── Daily topic ───────────────────────────────────────────────
    dailyTopic: daily,

    repickTopic() {
      const topic = pickDailyTopic(get().history, true);
      set({ dailyTopic: topic, currentScript: null, status: 'idle', errorMessage: null });
    },

    // ── Generation ────────────────────────────────────────────────
    status:        'idle',
    errorMessage:  null,
    currentScript: null,
    activeScene:   0,

    async generate() {
      const { dailyTopic, settings, history } = get();

      if (!dailyTopic) {
        set({ status: 'error', errorMessage: 'No topic selected' });
        return;
      }
      if (!isValidApiKey(settings.apiKey)) {
        set({ status: 'error', errorMessage: 'Please enter a valid Anthropic API key' });
        return;
      }

      set({ status: 'generating', errorMessage: null });

      try {
        const nextTopic = recommendNext(dailyTopic.id, history);

        const script = await generateScript({
          topic:          dailyTopic,
          level:          settings.defaultLevel,
          apiKey:         settings.apiKey,
          history,
          nextTopicTitle: nextTopic?.title ?? null,
        });

        // Record in history (not completed yet — user marks it done)
        const updatedHistory = upsertWatchEntry(history, dailyTopic.id, {
          level:     settings.defaultLevel,
          watchedAt: new Date().toISOString(),
        });
        saveHistory(updatedHistory);

        set({
          status:        'ready',
          currentScript: script,
          activeScene:   0,
          history:       updatedHistory,
        });
      } catch (err) {
        set({
          status:       'error',
          errorMessage: err instanceof Error ? err.message : 'Unexpected error',
        });
      }
    },

    setActiveScene(idx) {
      const total = get().currentScript?.scenes.length ?? 0;
      const clamped = Math.max(0, Math.min(idx, total - 1));
      set({ activeScene: clamped });
    },

    // ── Derived ───────────────────────────────────────────────────
    stats: () => curriculumStats(get().history),
  };
});
