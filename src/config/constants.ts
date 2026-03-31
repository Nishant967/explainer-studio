// App-wide constants — one place to change them all

export const APP_NAME = 'AI Explainer Studio';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  WATCH_HISTORY: 'aes_watch_history_v1',
  SETTINGS:      'aes_settings_v1',
  DAILY_TOPIC:   'aes_daily_topic_v1',
} as const;

// API key is ONLY kept in sessionStorage (cleared on tab close)
export const SESSION_KEYS = {
  API_KEY: 'aes_api_key',
} as const;

export const ANTHROPIC = {
  API_URL: 'https://api.anthropic.com/v1/messages',
  MODEL:   'claude-haiku-4-5-20251001', // Haiku: cheapest, fast, good enough for structured JSON
  MAX_TOKENS: 1500,
  VERSION: '2023-06-01',
} as const;

export const REMOTION = {
  FPS: 30,
  WIDTH: 1920,
  HEIGHT: 1080,
  COMPOSITION_ID: 'AIExplainer',
} as const;

export const SCENE_DEFAULTS = {
  title:     { durationInFrames: 75  },
  hook:      { durationInFrames: 60  },
  analogy:   { durationInFrames: 120 },
  explainer: { durationInFrames: 150 },
  diagram:   { durationInFrames: 120 },
  summary:   { durationInFrames: 90  },
  teaser:    { durationInFrames: 60  },
} as const;

export const LEVEL_LABELS: Record<string, string> = {
  beginner:     '🟢 Beginner',
  intermediate: '🟡 Intermediate',
  advanced:     '🔴 Advanced',
  research:     '🔬 Research',
};

export const LEVEL_AUDIENCE: Record<string, string> = {
  beginner:     'Explain everything like the viewer is a curious 10-year-old. Use everyday analogies — toys, food, sports, animals. Zero jargon. Short punchy sentences. Fun tone.',
  intermediate: 'Assume basic tech literacy. Use real terminology but always define it. Balance intuition with technical detail. Suitable for a curious adult or high schooler.',
  advanced:     'Assume ML/CS background. Use correct terminology, discuss architecture tradeoffs, reference common pitfalls. Dense but clear.',
  research:     'PhD-level audience. Reference seminal papers, discuss open problems, recent advances. Technically rigorous with nuance.',
};
