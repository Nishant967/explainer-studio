/**
 * Claude API Service
 *
 * Single responsibility: call the Anthropic API and parse the response.
 * - Uses claude-haiku for cost efficiency (structured JSON output)
 * - Validates the response shape before returning
 * - Throws typed errors the UI layer can handle gracefully
 */

import { ANTHROPIC, LEVEL_AUDIENCE, SCENE_DEFAULTS } from '../config/constants';
import { CATEGORY_MAP, TOPIC_MAP } from '../config/curriculum';
import type {
  VideoScript,
  ScriptScene,
  SceneType,
  DifficultyLevel,
  CurriculumTopic,
  WatchEntry,
} from '../types';

// ── Error types ────────────────────────────────────────────────────

export class ApiKeyError extends Error {
  constructor() { super('Invalid or missing API key'); this.name = 'ApiKeyError'; }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message); this.name = 'ApiError';
  }
}

export class ParseError extends Error {
  constructor(message: string) { super(message); this.name = 'ParseError'; }
}

// ── Prompt builder ────────────────────────────────────────────────

function buildPrompt(
  topic: CurriculumTopic,
  level: DifficultyLevel,
  recentTopics: string[],
  nextTopicTitle: string | null,
): string {
  const category = CATEGORY_MAP.get(topic.category);
  const prereqTitles = topic.prerequisites
    .map(id => TOPIC_MAP.get(id)?.title)
    .filter(Boolean)
    .join(', ');

  // Token-optimised: we give Claude exactly what it needs, nothing else.
  return `Generate a Remotion video script as JSON for the following AI concept explainer.

TOPIC: ${topic.title}
CATEGORY: ${category?.label ?? topic.category}
LEVEL: ${level}
AUDIENCE: ${LEVEL_AUDIENCE[level]}
PREREQUISITES COVERED: ${prereqTitles || 'none'}
RECENTLY WATCHED: ${recentTopics.slice(0, 3).join(', ') || 'none'}
NEXT TOPIC AFTER THIS: ${nextTopicTitle ?? 'to be determined'}

NARRATIVE RULES:
- Each scene must logically flow from the previous
- If viewer has seen prerequisites, reference them briefly ("Remember how X worked?")
- Arc: hook → intuition/analogy → core concept → mechanism → real-world use → summary → teaser
- All explanations must be graspable by someone new to the concept at this difficulty level

Return ONLY valid JSON matching this exact schema (no markdown fences):
{
  "coherenceThread": "string — one sentence describing the narrative spine",
  "scenes": [
    {
      "type": "title|hook|analogy|explainer|diagram|summary|teaser",
      "title": "string",
      "narration": "string — what the narrator says (1-3 sentences)",
      "bullets": ["string", "string"],
      "durationInFrames": number,
      "accentColor": "#hexcode",
      "keyInsight": "string — the single insight viewer must leave with",
      "buildsPrevious": boolean
    }
  ],
  "nextTopicId": "string or null",
  "nextTopicTitle": "string or null"
}`;
}

// ── Response validation ────────────────────────────────────────────

const VALID_SCENE_TYPES = new Set<string>([
  'title','hook','analogy','explainer','diagram','summary','teaser'
]);

function validateAndNormalise(
  raw: unknown,
  topic: CurriculumTopic,
  level: DifficultyLevel,
): VideoScript {
  if (typeof raw !== 'object' || raw === null) {
    throw new ParseError('Response is not an object');
  }

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.scenes) || obj.scenes.length === 0) {
    throw new ParseError('Missing or empty scenes array');
  }

  const category = CATEGORY_MAP.get(topic.category);

  const scenes: ScriptScene[] = obj.scenes.map((s: unknown, i: number) => {
    if (typeof s !== 'object' || s === null) throw new ParseError(`Scene ${i} is not an object`);
    const sc = s as Record<string, unknown>;

    const type = VALID_SCENE_TYPES.has(String(sc.type))
      ? (sc.type as SceneType)
      : 'explainer';

    const durationInFrames =
      typeof sc.durationInFrames === 'number' && sc.durationInFrames > 0
        ? sc.durationInFrames
        : SCENE_DEFAULTS[type]?.durationInFrames ?? 90;

    return {
      type,
      title:            String(sc.title            ?? ''),
      narration:        String(sc.narration         ?? ''),
      bullets:          Array.isArray(sc.bullets) ? (sc.bullets as unknown[]).map(String) : [],
      durationInFrames,
      accentColor:      /^#[0-9a-fA-F]{6}$/.test(String(sc.accentColor ?? ''))
                          ? String(sc.accentColor)
                          : category?.color ?? '#7b5ea7',
      keyInsight:       String(sc.keyInsight       ?? ''),
      buildsPrevious:   Boolean(sc.buildsPrevious),
    };
  });

  const totalDurationInFrames = scenes.reduce((s, sc) => s + sc.durationInFrames, 0);

  return {
    topicId:               topic.id,
    topicTitle:            topic.title,
    category:              topic.category,
    level,
    coherenceThread:       String(obj.coherenceThread ?? ''),
    nextTopicId:           typeof obj.nextTopicId === 'string' ? obj.nextTopicId : null,
    nextTopicTitle:        typeof obj.nextTopicTitle === 'string' ? obj.nextTopicTitle : null,
    totalDurationInFrames,
    scenes,
    generatedAt:           new Date().toISOString(),
  };
}

// ── Public API ────────────────────────────────────────────────────

export async function generateScript(params: {
  topic: CurriculumTopic;
  level: DifficultyLevel;
  apiKey: string;
  history: WatchEntry[];
  nextTopicTitle: string | null;
}): Promise<VideoScript> {
  const { topic, level, apiKey, history, nextTopicTitle } = params;

  if (!apiKey || !apiKey.startsWith('sk-')) throw new ApiKeyError();

  const recentTopics = history
    .filter(e => e.completed)
    .slice(-5)
    .map(e => e.topicTitle);

  const prompt = buildPrompt(topic, level, recentTopics, nextTopicTitle);

  const response = await fetch(ANTHROPIC.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC.VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:      ANTHROPIC.MODEL,
      max_tokens: ANTHROPIC.MAX_TOKENS,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (response.status === 401) throw new ApiKeyError();
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    const msg = typeof body.error === 'object' && body.error !== null
      ? String((body.error as Record<string, unknown>).message ?? response.statusText)
      : response.statusText;
    throw new ApiError(response.status, msg);
  }

  const data = await response.json() as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content?.find(b => b.type === 'text')?.text ?? '';
  if (!text) throw new ParseError('Empty response from Claude');

  // Strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new ParseError(`Could not parse Claude response as JSON: ${clean.slice(0, 120)}`);
  }

  return validateAndNormalise(parsed, topic, level);
}

export function isValidApiKey(key: string): boolean {
  return typeof key === 'string' && key.startsWith('sk-') && key.length > 20;
}
