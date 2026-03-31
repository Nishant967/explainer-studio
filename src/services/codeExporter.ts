/**
 * Code Exporter
 * Generates copy-pasteable Remotion composition code from a script.
 */

import type { VideoScript } from '../types';
import { REMOTION } from '../config/constants';

const COMPONENT_MAP: Record<string, string> = {
  title:    'TitleScene',
  hook:     'HookScene',
  analogy:  'AnalogyScene',
  explainer:'ExplainerScene',
  diagram:  'DiagramScene',
  summary:  'SummaryScene',
  teaser:   'TeaserScene',
};

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

export function generateRemotionCode(script: VideoScript): string {
  const compName = toPascalCase(script.topicTitle) + 'Video';
  const usedComponents = [...new Set(script.scenes.map(s => COMPONENT_MAP[s.type] ?? 'ExplainerScene'))];
  const imports = usedComponents.map(c => `import { ${c} } from './scenes/${c}';`).join('\n');

  const sequences = script.scenes.map((sc, i) => {
    const comp = COMPONENT_MAP[sc.type] ?? 'ExplainerScene';
    const bulletsJson = JSON.stringify(sc.bullets);
    return `  {/* ${String(i + 1).padStart(2, '0')} · ${sc.type.toUpperCase()} · ${sc.title} */}
  <Series.Sequence durationInFrames={${sc.durationInFrames}}>
    <${comp}
      title={${JSON.stringify(sc.title)}}
      narration={${JSON.stringify(sc.narration)}}
      bullets={${bulletsJson}}
      accentColor="${sc.accentColor}"
      keyInsight={${JSON.stringify(sc.keyInsight)}}
    />
  </Series.Sequence>`;
  }).join('\n\n');

  return `// ═══════════════════════════════════════════════════════
// AI Explainer Studio — Remotion Composition
// Topic    : ${script.topicTitle}
// Category : ${script.category}
// Level    : ${script.level}
// Thread   : ${script.coherenceThread}
// Generated: ${new Date(script.generatedAt).toLocaleString()}
// ═══════════════════════════════════════════════════════

import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { registerRoot, Composition } from 'remotion';
${imports}

export const ${compName}: React.FC = () => (
  <AbsoluteFill style={{ background: '#08080e' }}>
    <Series>

${sequences}

    </Series>
  </AbsoluteFill>
);

// ── Register in remotion/index.ts ───────────────────────
// registerRoot(() => (
//   <Composition
//     id="${REMOTION.COMPOSITION_ID}"
//     component={${compName}}
//     durationInFrames={${script.totalDurationInFrames}}
//     fps={${REMOTION.FPS}}
//     width={${REMOTION.WIDTH}}
//     height={${REMOTION.HEIGHT}}
//   />
// ));
//
// Render:
// npx remotion render remotion/index.ts ${REMOTION.COMPOSITION_ID} out/${script.topicId}.mp4`;
}
