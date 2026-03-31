/**
 * Topic Scheduler
 *
 * Responsibilities:
 *  1. Pick today's topic deterministically (same result all day)
 *  2. Never repeat a completed topic
 *  3. Prefer topics whose prerequisites have been watched (contextual ordering)
 *  4. Fall back to prerequisite-free topics when nothing fits perfectly
 */

import { TOPICS } from '../config/curriculum';
import type { CurriculumTopic, WatchEntry } from '../types';

/** Returns the set of completed topic IDs from watch history */
function completedSet(history: WatchEntry[]): Set<string> {
  return new Set(history.filter(e => e.completed).map(e => e.topicId));
}

/** Returns a stable 0-based day index that changes every midnight */
function dayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

/**
 * Score a topic based on how many of its prerequisites are completed.
 * Higher score = more contextually appropriate right now.
 */
function prerequisiteScore(topic: CurriculumTopic, completed: Set<string>): number {
  if (topic.prerequisites.length === 0) return 1; // no prereqs — always ready
  const met = topic.prerequisites.filter(p => completed.has(p)).length;
  return met / topic.prerequisites.length;
}

/**
 * Pick the topic for today.
 * - Excludes completed topics.
 * - Sorts remaining topics by how many prerequisites are satisfied.
 * - Within the same score tier, uses a day-seeded index for variety.
 *
 * @param history  Full watch history
 * @param forceRandom  If true, randomises within the best tier (for "repick")
 */
export function pickDailyTopic(
  history: WatchEntry[],
  forceRandom = false,
): CurriculumTopic | null {
  const completed = completedSet(history);

  const candidates = TOPICS.filter(t => !completed.has(t.id));
  if (candidates.length === 0) return null;

  // Score each candidate
  const scored = candidates.map(t => ({
    topic: t,
    score: prerequisiteScore(t, completed),
  }));

  // Find the maximum score in the pool
  const maxScore = Math.max(...scored.map(s => s.score));

  // Only consider topics at (or very close to) the top score
  const topTier = scored.filter(s => s.score >= maxScore - 0.01).map(s => s.topic);

  // Also avoid picking from categories covered in last 3 sessions
  const recentCategories = new Set(history.slice(-3).map(e => e.category));
  const diverse = topTier.filter(t => !recentCategories.has(t.category));
  const pool = diverse.length > 0 ? diverse : topTier;

  if (forceRandom) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Deterministic: same pick all day
  return pool[dayIndex() % pool.length];
}

/**
 * Find the recommended next topic after a given one.
 * Returns the topic that lists this one as a prerequisite and
 * has the most of its other prerequisites already completed.
 */
export function recommendNext(
  currentTopicId: string,
  history: WatchEntry[],
): CurriculumTopic | null {
  const completed = completedSet(history);

  const directSuccessors = TOPICS.filter(t =>
    t.prerequisites.includes(currentTopicId) && !completed.has(t.id)
  );

  if (directSuccessors.length === 0) return null;

  // Pick the one with the most prerequisites already met
  directSuccessors.sort((a, b) => {
    const sa = prerequisiteScore(a, completed);
    const sb = prerequisiteScore(b, completed);
    return sb - sa;
  });

  return directSuccessors[0];
}

/**
 * Returns a summary of curriculum completion.
 */
export function curriculumStats(history: WatchEntry[]) {
  const completed = completedSet(history);
  const streak = computeStreak(history);

  return {
    total:     TOPICS.length,
    completed: completed.size,
    remaining: TOPICS.length - completed.size,
    streak,
  };
}

function computeStreak(history: WatchEntry[]): number {
  const completedDays = history
    .filter(e => e.completed)
    .map(e => {
      const d = new Date(e.watchedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

  if (completedDays.length === 0) return 0;

  const unique = [...new Set(completedDays)].sort((a, b) => b - a);
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    if ((unique[i - 1] - unique[i]) / 86_400_000 === 1) streak++;
    else break;
  }
  return streak;
}
