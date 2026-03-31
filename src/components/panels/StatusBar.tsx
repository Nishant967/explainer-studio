import React from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import { APP_VERSION } from '../../config/constants';

export const StatusBar: React.FC = () => {
  const { status, dailyTopic, currentScript } = useAppStore();

  const dotClass = {
    idle:       'bg-white/20',
    generating: 'bg-amber-400 shadow-amber-400/50 shadow-sm animate-pulse',
    ready:      'bg-teal-400 shadow-teal-400/50 shadow-sm',
    error:      'bg-red-400 shadow-red-400/50 shadow-sm',
  }[status];

  const message = {
    idle:       dailyTopic ? `${dailyTopic.title} — click Generate Script` : 'Add your API key and click Generate Script',
    generating: `Generating script for "${dailyTopic?.title}"…`,
    ready:      `Script ready · ${currentScript?.scenes.length} scenes · ${((currentScript?.totalDurationInFrames ?? 0) / 30).toFixed(0)}s`,
    error:      'Generation failed — check your API key and try again',
  }[status];

  return (
    <div
      className="flex items-center gap-2 px-5 py-1.5 bg-[#0f0f18] border-t border-white/7 font-mono text-[10px] text-white/25"
      role="status"
      aria-live="polite"
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} aria-hidden />
      <span className="flex-1 truncate">{message}</span>
      <span className="flex-shrink-0 text-white/15">v{APP_VERSION}</span>
    </div>
  );
};
