/**
 * Code Exporter
 * Generates the script.json content to drop into remotion/script.json.
 * The existing Remotion pipeline (Root.tsx → VideoComposition) picks it up automatically.
 */

import type { VideoScript } from '../types';

export function generateRemotionCode(script: VideoScript): string {
  return JSON.stringify(script, null, 2);
}
