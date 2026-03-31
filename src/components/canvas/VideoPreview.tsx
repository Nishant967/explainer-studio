/**
 * VideoPreview
 * Canvas area: viewport, scene tabs, timeline scrubber.
 */

import React, { useCallback } from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import { SceneRenderer } from './SceneRenderer';
import { CATEGORIES } from '../../config/curriculum';

export const VideoPreview: React.FC = () => {
  const {
    currentScript, status, activeScene,
    setActiveScene, dailyTopic, errorMessage,
  } = useAppStore();

  const cat = dailyTopic ? CATEGORIES.find(c => c.id === dailyTopic.category) : null;

  const navigate = useCallback((delta: number) => {
    if (!currentScript) return;
    const next = activeScene + delta;
    setActiveScene(Math.max(0, Math.min(next, currentScript.scenes.length - 1)));
  }, [activeScene, currentScript, setActiveScene]);

  // ── Empty / error states ─────────────────────────────────────────
  if (status === 'idle' || status === 'error') {
    return (
      <div className="flex-1 flex flex-col bg-[#08080e]">
        {/* Scene tab bar placeholder */}
        <div className="h-9 bg-[#0f0f18] border-b border-white/7 flex items-center px-4">
          <span className="font-mono text-[10px] text-white/25 uppercase tracking-wider">Preview</span>
        </div>

        {/* Viewport */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <GridBg />
          <div className="relative z-10 text-center flex flex-col items-center gap-4 max-w-sm">
            <span className="text-5xl opacity-25" aria-hidden>🎬</span>
            <p className="text-lg font-extrabold text-white/30">No script yet</p>
            {status === 'error' && errorMessage ? (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 leading-snug">
                {errorMessage}
              </p>
            ) : (
              <p className="text-sm text-white/20 leading-relaxed">
                Add your API key, pick a difficulty, then click <strong className="text-white/40">Generate Script</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Generating state ─────────────────────────────────────────────
  if (status === 'generating') {
    return (
      <div className="flex-1 flex flex-col bg-[#08080e]">
        <div className="h-9 bg-[#0f0f18] border-b border-white/7" />
        <div className="flex-1 flex items-center justify-center">
          <GridBg />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin" aria-hidden />
            <p className="text-sm font-semibold text-white/50">
              Claude is generating your script…
            </p>
            <p className="font-mono text-[11px] text-white/25">
              {dailyTopic?.title}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Ready state ──────────────────────────────────────────────────
  const scenes   = currentScript!.scenes;
  const scene    = scenes[activeScene];
  const totalSec = (currentScript!.totalDurationInFrames / 30).toFixed(0);

  return (
    <div className="flex-1 flex flex-col bg-[#08080e] overflow-hidden">

      {/* Scene tabs */}
      <div
        className="h-9 bg-[#0f0f18] border-b border-white/7 flex items-center gap-1 px-3 overflow-x-auto flex-shrink-0"
        role="tablist"
        aria-label="Scenes"
      >
        {scenes.map((sc, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeScene}
            onClick={() => setActiveScene(i)}
            className={[
              'px-3 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0',
              'outline-none focus-visible:ring-1 focus-visible:ring-purple-500',
              i === activeScene
                ? 'bg-[#1e1e2a] text-white border border-white/12'
                : 'text-white/30 hover:text-white/60 border border-transparent',
            ].join(' ')}
          >
            {String(i + 1).padStart(2, '0')} {sc.type}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <GridBg />
        <div
          className="relative z-10 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10"
          style={{ maxWidth: 680, aspectRatio: '16/9' }}
          role="img"
          aria-label={`Scene ${activeScene + 1}: ${scene.title}`}
        >
          <SceneRenderer
            scene={scene}
            topicCategory={cat?.label ?? dailyTopic?.category ?? ''}
            topicTitle={dailyTopic?.title ?? ''}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#0f0f18] border-t border-white/7 px-5 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            className="w-7 h-7 rounded border border-white/10 bg-[#16161f] text-white/50 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center text-xs"
            onClick={() => navigate(-1)}
            disabled={activeScene === 0}
            aria-label="Previous scene"
          >
            ◀
          </button>
          <button
            className="w-7 h-7 rounded border border-white/10 bg-[#16161f] text-white/50 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center text-xs"
            onClick={() => navigate(1)}
            disabled={activeScene === scenes.length - 1}
            aria-label="Next scene"
          >
            ▶
          </button>
          <span className="font-mono text-[11px] text-white/40">
            Scene {activeScene + 1} / {scenes.length}
          </span>
          <span className="font-mono text-[11px] text-white/20 ml-auto">
            {totalSec}s total · {(scene.durationInFrames / 30).toFixed(1)}s this scene
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={scenes.length - 1}
          value={activeScene}
          onChange={e => setActiveScene(Number(e.target.value))}
          className="w-full h-1 rounded-full bg-white/10 appearance-none cursor-pointer accent-purple-500"
          aria-label="Scene scrubber"
        />
      </div>
    </div>
  );
};

// ── Grid background ───────────────────────────────────────────────
const GridBg: React.FC = () => (
  <div
    aria-hidden
    className="absolute inset-0 opacity-40"
    style={{
      backgroundImage: 'linear-gradient(#16161f 1px, transparent 1px), linear-gradient(90deg, #16161f 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }}
  />
);
