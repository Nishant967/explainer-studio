/**
 * Claude Code fallback service
 *
 * Calls the local proxy server (server.ts) which runs `claude -p "..."` CLI.
 * Same interface as generateScript() in claude.ts — returns VideoScript.
 */

import { LEVEL_AUDIENCE, SCENE_DEFAULTS } from '../config/constants';
import { CATEGORY_MAP, TOPIC_MAP } from '../config/curriculum';
import { ParseError, ApiError } from './claude';
import type {
  VideoScript,
  ScriptScene,
  SceneType,
  DifficultyLevel,
  CurriculumTopic,
  WatchEntry,
} from '../types';

const SERVER_URL = 'http://localhost:3001/generate';

function buildPrompt(
  topic: CurriculumTopic,
  level: DifficultyLevel,
  recentTopics: string[],
  nextTopicTitle: string | null,
): string {
  const category    = CATEGORY_MAP.get(topic.category);
  const prereqTitles = topic.prerequisites
    .map(id => TOPIC_MAP.get(id)?.title)
    .filter(Boolean)
    .join(', ');

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

const VALID_SCENE_TYPES = new Set<string>([
  'title', 'hook', 'analogy', 'explainer', 'diagram', 'summary', 'teaser',
]);

function validateAndNormalise(
  raw: unknown,
  topic: CurriculumTopic,
  level: DifficultyLevel,
): VideoScript {
  if (typeof raw !== 'object' || raw === null) throw new ParseError('Response is not an object');

  const obj = raw as Record<string, unknown>;
  if (!Array.isArray(obj.scenes) || obj.scenes.length === 0) {
    throw new ParseError('Missing or empty scenes array');
  }

  const category = CATEGORY_MAP.get(topic.category);

  const scenes: ScriptScene[] = obj.scenes.map((s: unknown, i: number) => {
    if (typeof s !== 'object' || s === null) throw new ParseError(`Scene ${i} is not an object`);
    const sc = s as Record<string, unknown>;
    const type = VALID_SCENE_TYPES.has(String(sc.type)) ? (sc.type as SceneType) : 'explainer';
    const durationInFrames =
      typeof sc.durationInFrames === 'number' && sc.durationInFrames > 0
        ? sc.durationInFrames
        : SCENE_DEFAULTS[type]?.durationInFrames ?? 90;

    return {
      type,
      title:           String(sc.title       ?? ''),
      narration:       String(sc.narration    ?? ''),
      bullets:         Array.isArray(sc.bullets) ? (sc.bullets as unknown[]).map(String) : [],
      durationInFrames,
      accentColor:     /^#[0-9a-fA-F]{6}$/.test(String(sc.accentColor ?? ''))
                         ? String(sc.accentColor)
                         : category?.color ?? '#7b5ea7',
      keyInsight:      String(sc.keyInsight   ?? ''),
      buildsPrevious:  Boolean(sc.buildsPrevious),
    };
  });

  return {
    topicId:               topic.id,
    topicTitle:            topic.title,
    category:              topic.category,
    level,
    coherenceThread:       String(obj.coherenceThread ?? ''),
    nextTopicId:           typeof obj.nextTopicId === 'string' ? obj.nextTopicId : null,
    nextTopicTitle:        typeof obj.nextTopicTitle === 'string' ? obj.nextTopicTitle : null,
    totalDurationInFrames: scenes.reduce((s, sc) => s + sc.durationInFrames, 0),
    scenes,
    generatedAt:           new Date().toISOString(),
  };
}

export async function generateScriptViaClaudeCode(params: {
  topic: CurriculumTopic;
  level: DifficultyLevel;
  history: WatchEntry[];
  nextTopicTitle: string | null;
}): Promise<VideoScript> {
  const { topic, level, history, nextTopicTitle } = params;

  const recentTopics = history
    .filter(e => e.completed)
    .slice(-5)
    .map(e => e.topicTitle);

  const prompt = buildPrompt(topic, level, recentTopics, nextTopicTitle);

  let response: Response;
  try {
    response = await fetch(SERVER_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ prompt }),
    });
  } catch {
    throw new ApiError(0, 'Claude Code server is not running. Start it with: npm run server');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    throw new ApiError(response.status, String(body.error ?? response.statusText));
  }

  const { text } = await response.json() as { text: string };
  if (!text) throw new ParseError('Empty response from Claude Code');

  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new ParseError(`Could not parse response as JSON: ${clean.slice(0, 120)}`);
  }

  return validateAndNormalise(parsed, topic, level);
}
