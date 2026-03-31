import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { SceneProps } from './types';

export const StepScene: React.FC<SceneProps> = ({ scene }) => {
  const accent = scene.accentColor;
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 14 } });
  const headerY      = interpolate(headerSpring, [0, 1], [20, 0]);
  const narrationOpacity = Math.min(1, Math.max(0, (frame - 10) / 20));

  return (
    <AbsoluteFill
      style={{
        background: '#08080e',
        display: 'flex', flexDirection: 'column',
        padding: '56px 80px', gap: 20,
        fontFamily: '"Bricolage Grotesque", sans-serif',
      }}
    >
      {/* Kicker + title */}
      <div style={{ opacity: headerSpring, transform: `translateY(${headerY}px)` }}>
        <p style={{ fontFamily:'monospace', fontSize:13, color: accent, letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>
          {scene.type}
        </p>
        <h2 style={{ fontSize:52, fontWeight:900, color:'#ffffff', lineHeight:1.1, letterSpacing:-1 }}>
          {scene.title}
        </h2>
      </div>

      {/* Narration */}
      <p style={{ opacity: narrationOpacity, fontSize:22, color:'rgba(255,255,255,0.45)', lineHeight:1.55, maxWidth:900 }}>
        {scene.narration}
      </p>

      {/* Bullets — staggered by frame math, no hooks in loop */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
        {scene.bullets.map((bullet, i) => {
          const delay   = 18 + i * 8;
          const bSpring = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const bX      = interpolate(bSpring, [0, 1], [-20, 0]);
          return (
            <div
              key={i}
              style={{
                display:'flex', gap:20, alignItems:'flex-start',
                padding:'16px 20px', borderRadius:10,
                borderLeft:`3px solid ${accent}`,
                background:'rgba(255,255,255,0.03)',
                opacity: bSpring,
                transform: `translateX(${bX}px)`,
              }}
            >
              <span style={{ fontFamily:'monospace', fontSize:14, fontWeight:700, color:accent, flexShrink:0, marginTop:2 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize:22, color:'rgba(255,255,255,0.78)', lineHeight:1.45 }}>
                {bullet}
              </span>
            </div>
          );
        })}
      </div>

      {/* Key insight */}
      {scene.keyInsight && (
        <div style={{
          fontSize:18, fontStyle:'italic', color:accent,
          padding:'12px 18px', borderRadius:8,
          borderLeft:`3px solid ${accent}`, background:`${accent}0f`,
        }}>
          💡 {scene.keyInsight}
        </div>
      )}
    </AbsoluteFill>
  );
};
