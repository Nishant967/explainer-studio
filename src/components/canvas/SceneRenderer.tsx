/**
 * SceneRenderer
 * Renders a single script scene as an animated canvas preview.
 * This is a live HTML preview — the Remotion compositions use the
 * same visual language but are separate TSX files in /remotion.
 */

import React from 'react';
import type { ScriptScene } from '../../types';

interface SceneRendererProps {
  scene:     ScriptScene;
  topicCategory: string;
  topicTitle:    string;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, topicCategory, topicTitle }) => {
  const accent = scene.accentColor;

  switch (scene.type) {
    case 'title':    return <TitleScene    scene={scene} category={topicCategory} />;
    case 'hook':     return <HookScene     scene={scene} accent={accent} />;
    case 'analogy':
    case 'explainer':
    case 'diagram':
    // case 'comparison':
    // case 'gotcha':   return <StepScene     scene={scene} accent={accent} />;
    case 'summary':  return <SummaryScene  scene={scene} accent={accent} />;
    case 'teaser':   return <TeaserScene   scene={scene} accent={accent} />;
    default:         return <StepScene     scene={scene} accent={accent} />;
  }
};

// ── Individual scene layouts ───────────────────────────────────────

const TitleScene: React.FC<{ scene: ScriptScene; category: string }> = ({ scene, category }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center text-center px-12 gap-4"
    style={{ background: `radial-gradient(ellipse at 60% 40%, ${scene.accentColor}18 0%, #08080e 70%)` }}
  >
    <span
      className="font-mono text-[10px] px-3 py-1 rounded border uppercase tracking-[3px]"
      style={{ color: scene.accentColor, borderColor: scene.accentColor + '44', background: scene.accentColor + '11' }}
    >
      {category}
    </span>
    <h2 className="text-3xl font-black leading-tight tracking-tight text-white max-w-lg">
      {scene.title}
    </h2>
    <p className="text-sm text-white/40 max-w-sm leading-relaxed">{scene.narration}</p>
  </div>
);

const HookScene: React.FC<{ scene: ScriptScene; accent: string }> = ({ scene, accent }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center text-center px-12 gap-5"
    style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent}12 0%, #08080e 70%)` }}
  >
    <p className="font-mono text-[10px] tracking-[3px] uppercase" style={{ color: accent }}>Question</p>
    <p className="text-2xl font-black leading-snug max-w-md text-white">{scene.narration || scene.title}</p>
    <p className="text-xs text-white/30">Let's find out.</p>
  </div>
);

const StepScene: React.FC<{ scene: ScriptScene; accent: string }> = ({ scene, accent }) => (
  <div className="w-full h-full flex flex-col px-8 py-6 gap-3" style={{ background: '#08080e' }}>
    <p className="font-mono text-[9px] tracking-[2px] uppercase" style={{ color: accent }}>{scene.type}</p>
    <h3 className="text-xl font-black text-white leading-tight">{scene.title}</h3>
    <p className="text-xs text-white/45 leading-relaxed">{scene.narration}</p>
    <ul className="flex flex-col gap-2 flex-1 mt-1">
      {scene.bullets.map((b, i) => (
        <li
          key={i}
          className="flex gap-3 items-start px-3 py-2 rounded-lg border-l-2"
          style={{
            borderLeftColor: accent,
            background: '#ffffff06',
            animationDelay: `${i * 90}ms`,
          }}
        >
          <span className="font-mono text-[10px] font-bold mt-0.5 flex-shrink-0" style={{ color: accent }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-[12px] text-white/75 leading-snug">{b}</span>
        </li>
      ))}
    </ul>
    {scene.keyInsight && (
      <div
        className="text-[11px] italic px-3 py-2 rounded-lg border-l-2 mt-1"
        style={{ color: accent, borderLeftColor: accent, background: accent + '0f' }}
      >
        💡 {scene.keyInsight}
      </div>
    )}
  </div>
);

const SummaryScene: React.FC<{ scene: ScriptScene; accent: string }> = ({ scene, accent }) => (
  <div className="w-full h-full flex flex-col px-8 py-6 gap-3" style={{ background: '#08080e' }}>
    <p className="font-mono text-[9px] tracking-[2px] uppercase" style={{ color: accent }}>Key Takeaways</p>
    <h3 className="text-xl font-black text-white">{scene.title}</h3>
    <ul className="flex flex-col gap-3 flex-1">
      {scene.bullets.map((b, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="text-base flex-shrink-0 mt-0.5" style={{ color: accent }}>✦</span>
          <span className="text-[13px] font-semibold text-white/80 leading-snug">{b}</span>
        </li>
      ))}
    </ul>
    {scene.keyInsight && (
      <div className="text-xs italic text-white/40 border-t border-white/7 pt-3">{scene.keyInsight}</div>
    )}
  </div>
);

const TeaserScene: React.FC<{ scene: ScriptScene; accent: string }> = ({ scene, accent }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-12"
    style={{ background: `radial-gradient(ellipse at 50% 60%, ${accent}12 0%, #08080e 70%)` }}
  >
    <p className="font-mono text-[9px] tracking-[2px] uppercase text-white/30">Up next</p>
    <p className="text-2xl font-black text-white">{scene.title}</p>
    <p
      className="text-4xl animate-bounce"
      style={{ color: accent }}
      aria-hidden
    >↓</p>
    <p className="text-xs text-white/30 max-w-xs leading-relaxed">{scene.narration}</p>
  </div>
);
