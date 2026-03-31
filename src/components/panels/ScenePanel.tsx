import React from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import type { ScriptScene } from '../../types';

const SCENE_TYPE_COLORS: Record<string, string> = {
  title:    '#7b5ea7',
  hook:     '#e8645a',
  analogy:  '#f0c040',
  explainer:'#4ec9a0',
  diagram:  '#5b9cf6',
  summary:  '#5b9cf6',
  teaser:   '#f0c040',
};

const SceneCard: React.FC<{
  scene:    ScriptScene;
  index:    number;
  isActive: boolean;
  onClick:  () => void;
}> = ({ scene, index, isActive, onClick }) => {
  const accent = scene.accentColor ?? SCENE_TYPE_COLORS[scene.type] ?? '#888';

  return (
    <div
      role="option"
      aria-selected={isActive}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={[
        'px-3 py-2.5 rounded-lg border cursor-pointer transition-all outline-none',
        'focus-visible:ring-2 focus-visible:ring-purple-500',
        isActive
          ? 'border-purple-500/60 bg-purple-500/10'
          : 'border-white/7 bg-[#16161f] hover:border-white/12',
      ].join(' ')}
    >
      <div className="flex items-start gap-2.5">
        {/* Index */}
        <span
          className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
          style={{ color: accent, background: accent + '15' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-wider mb-0.5" style={{ color: accent }}>
            {scene.type}
          </p>
          <p className="text-[12px] font-bold text-white leading-snug truncate">{scene.title}</p>
          <p className="text-[10px] text-white/40 mt-1 leading-snug line-clamp-2">
            {scene.narration}
          </p>
          {scene.keyInsight && (
            <p className="text-[10px] italic mt-1.5" style={{ color: accent + 'aa' }}>
              💡 {scene.keyInsight}
            </p>
          )}
        </div>

        {/* Duration */}
        <span className="font-mono text-[9px] text-white/25 flex-shrink-0">
          {(scene.durationInFrames / 30).toFixed(1)}s
        </span>
      </div>

      {scene.buildsPrevious && (
        <span
          className="inline-block mt-1.5 font-mono text-[9px] px-1.5 py-0.5 rounded"
          style={{ color: accent, background: accent + '11' }}
        >
          ↑ builds previous
        </span>
      )}
    </div>
  );
};

export const ScenePanel: React.FC = () => {
  const { currentScript, activeScene, setActiveScene, status } = useAppStore();

  if (status !== 'ready' || !currentScript) {
    return (
      <div className="flex flex-col h-full bg-[#0f0f18] border-l border-white/7">
        <div className="px-4 py-3 border-b border-white/7 flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Scenes</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-3xl opacity-25" aria-hidden>📋</span>
          <p className="text-[12px] text-white/25 leading-relaxed">
            Scenes will appear here after generating a script.
          </p>
        </div>
      </div>
    );
  }

  const totalSec = (currentScript.totalDurationInFrames / 30).toFixed(0);

  return (
    <div
      className="flex flex-col h-full bg-[#0f0f18] border-l border-white/7"
      style={{ width: 320 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/7 flex items-center justify-between flex-shrink-0">
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Scenes</span>
        <span className="font-mono text-[10px] text-white/25">
          {currentScript.scenes.length} scenes · {totalSec}s
        </span>
      </div>

      {/* Coherence thread */}
      {currentScript.coherenceThread && (
        <div className="px-4 py-3 border-b border-teal-500/10 bg-teal-500/5 flex-shrink-0">
          <p className="font-mono text-[9px] text-teal-400 uppercase tracking-wider mb-1">🧵 Narrative Thread</p>
          <p className="text-[11px] text-white/50 italic leading-snug">
            {currentScript.coherenceThread}
          </p>
        </div>
      )}

      {/* Scene list */}
      <div
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5"
        role="listbox"
        aria-label="Scenes"
      >
        {currentScript.scenes.map((scene, i) => (
          <SceneCard
            key={`${scene.type}-${i}`}
            scene={scene}
            index={i}
            isActive={i === activeScene}
            onClick={() => setActiveScene(i)}
          />
        ))}
      </div>

      {/* Next topic teaser */}
      {currentScript.nextTopicTitle && (
        <div className="px-4 py-3 border-t border-white/7 flex-shrink-0">
          <p className="font-mono text-[9px] text-white/25 uppercase tracking-wider mb-1">Up next</p>
          <p className="text-[12px] font-bold text-white/60">{currentScript.nextTopicTitle}</p>
        </div>
      )}
    </div>
  );
};
