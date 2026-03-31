import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import type { SceneProps } from './types';

export const SummaryScene: React.FC<SceneProps> = ({ scene }) => {
  const accent  = scene.accentColor;
  const frame   = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background:'#08080e', display:'flex', flexDirection:'column',
        padding:'56px 80px', gap:24,
        fontFamily:'"Bricolage Grotesque", sans-serif',
      }}
    >
      <div style={{ opacity: headerSpring }}>
        <p style={{ fontFamily:'monospace', fontSize:13, color:accent, letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>
          Key Takeaways
        </p>
        <h2 style={{ fontSize:52, fontWeight:900, color:'#ffffff', letterSpacing:-1 }}>{scene.title}</h2>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20, flex:1 }}>
        {scene.bullets.map((b, i) => {
          const delay   = 10 + i * 10;
          const bSpring = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const bX      = interpolate(bSpring, [0, 1], [-16, 0]);
          return (
            <div key={i} style={{ display:'flex', gap:20, alignItems:'flex-start', opacity:bSpring, transform:`translateX(${bX}px)` }}>
              <span style={{ fontSize:22, color:accent, flexShrink:0, marginTop:2 }}>✦</span>
              <span style={{ fontSize:24, fontWeight:600, color:'rgba(255,255,255,0.82)', lineHeight:1.4 }}>{b}</span>
            </div>
          );
        })}
      </div>

      {scene.keyInsight && (
        <p style={{ fontSize:18, color:'rgba(255,255,255,0.35)', borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:20, fontStyle:'italic' }}>
          {scene.keyInsight}
        </p>
      )}
    </AbsoluteFill>
  );
};
