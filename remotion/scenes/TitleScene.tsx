import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SceneProps } from './types';
import { useEntrance, useFade } from './shared';

export const TitleScene: React.FC<SceneProps> = ({ scene, category }) => {
  const frame   = useCurrentFrame();
  const tagS    = useEntrance(0);
  const titleS  = useEntrance(8);
  const subFade = useFade(20, 18);
  const accent  = scene.accentColor;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 60% 40%, ${accent}18 0%, #08080e 70%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 80, textAlign: 'center', gap: 20,
        fontFamily: '"Bricolage Grotesque", sans-serif',
      }}
    >
      {/* Category tag */}
      <div
        style={{
          transform: `translateY(${interpolate(tagS, [0,1], [24,0])}px)`,
          opacity: tagS,
          fontSize: 16, fontFamily: 'monospace', letterSpacing: 4,
          textTransform: 'uppercase', color: accent,
          border: `1px solid ${accent}44`, background: `${accent}11`,
          padding: '8px 20px', borderRadius: 6,
        }}
      >
        {category}
      </div>

      {/* Title */}
      <h1
        style={{
          transform: `translateY(${interpolate(titleS, [0,1], [32,0])}px)`,
          opacity: titleS,
          fontSize: 72, fontWeight: 900, color: '#ffffff',
          lineHeight: 1.05, letterSpacing: -2, margin: 0,
        }}
      >
        {scene.title}
      </h1>

      {/* Narration */}
      <p
        style={{
          opacity: subFade,
          fontSize: 24, color: 'rgba(255,255,255,0.45)',
          maxWidth: 640, lineHeight: 1.5, margin: 0,
        }}
      >
        {scene.narration}
      </p>
    </AbsoluteFill>
  );
};
