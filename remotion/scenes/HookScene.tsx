import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import type { SceneProps } from './types';
import { useEntrance, useFade } from './shared';

export const HookScene: React.FC<SceneProps> = ({ scene }) => {
  const accent  = scene.accentColor;
  const labelS  = useEntrance(0);
  const textS   = useEntrance(6);
  const subFade = useFade(15, 22);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${accent}14 0%, #08080e 70%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 80, textAlign: 'center', gap: 24,
        fontFamily: '"Bricolage Grotesque", sans-serif',
      }}
    >
      <p style={{ opacity: labelS, fontFamily:'monospace', fontSize:14, color: accent, letterSpacing:4, textTransform:'uppercase' }}>
        Question
      </p>
      <p
        style={{
          transform: `translateY(${interpolate(textS,[0,1],[28,0])}px)`,
          opacity: textS,
          fontSize: 54, fontWeight: 900, color:'#ffffff',
          lineHeight: 1.15, letterSpacing: -1, maxWidth: 800,
        }}
      >
        {scene.narration || scene.title}
      </p>
      <p style={{ opacity: subFade, fontSize:20, color:'rgba(255,255,255,0.3)' }}>
        Let's find out.
      </p>
    </AbsoluteFill>
  );
};
