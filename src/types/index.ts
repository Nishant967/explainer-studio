export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'research';

export type SceneType =
  | 'title'
  | 'hook'
  | 'analogy'
  | 'explainer'
  | 'diagram'
  | 'summary'
  | 'teaser';

export interface CurriculumTopic {
  id: string;
  title: string;
  category: string;
  prerequisites: string[];
  difficulty: DifficultyLevel;
}

export interface CurriculumCategory {
  id: string;
  label: string;
  color: string;
  order: number;
}

export interface ScriptScene {
  type: SceneType;
  title: string;
  narration: string;
  bullets: string[];
  durationInFrames: number;
  accentColor: string;
  keyInsight: string;
  buildsPrevious: boolean;
}

export interface VideoScript {
  topicId: string;
  topicTitle: string;
  category: string;
  level: DifficultyLevel;
  coherenceThread: string;
  nextTopicId: string | null;
  nextTopicTitle: string | null;
  totalDurationInFrames: number;
  scenes: ScriptScene[];
  generatedAt: string;
}

export interface WatchEntry {
  topicId: string;
  topicTitle: string;
  category: string;
  level: DifficultyLevel;
  watchedAt: string;
  completed: boolean;
}

export interface AppSettings {
  apiKey: string;
  defaultLevel: DifficultyLevel;
}

export type GenerationStatus = 'idle' | 'generating' | 'ready' | 'error';

export interface GenerationState {
  status: GenerationStatus;
  errorMessage: string | null;
  currentScript: VideoScript | null;
  activeSceneIndex: number;
}
