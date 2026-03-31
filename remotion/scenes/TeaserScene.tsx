import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { SceneProps } from './types';
import { useEntrance, useFade } from './shared';

export const TeaserScene: React.FC<SceneProps> = ({ scene }) => {
  const accent  = scene.accentColor;
  const frame   = useCurrentFrame();
  const titleS  = useEntrance(6);
  const subFade = useFade(20, 18);

  // Bouncing arrow
  const bounce = Math.sin((frame / 15) * Math.PI) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, ${accent}14 0%, #08080e 70%)`,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:80, textAlign:'center', gap:24,
        fontFamily:'"Bricolage Grotesque", sans-serif',
      }}
    >
      <p style={{ fontFamily:'monospace', fontSize:13, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase' }}>
        Up next
      </p>
      <p
        style={{
          fontSize:56, fontWeight:900, color:'#ffffff',
          opacity: titleS,
          transform: `translateY(${interpolate(titleS,[0,1],[24,0])}px)`,
        }}
      >
        {scene.title}
      </p>
      <p style={{ fontSize:40, color: accent, transform:`translateY(${bounce}px)` }} aria-hidden>↓</p>
      <p style={{ opacity: subFade, fontSize:22, color:'rgba(255,255,255,0.3)', maxWidth:600 }}>
        {scene.narration}
      </p>
    </AbsoluteFill>
  );
};
