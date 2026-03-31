import React, { useState } from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../config/curriculum';
import { LEVEL_LABELS } from '../../config/constants';
import type { DifficultyLevel } from '../../types';
import { isValidApiKey } from '../../services/claude';

export const Sidebar: React.FC = () => {
  const {
    settings, setApiKey, setLevel,
    history, clearHistory,
    stats, dailyTopic,
  } = useAppStore();

  const [keyVisible, setKeyVisible] = useState(false);
  const [keyDraft, setKeyDraft]     = useState(settings.apiKey);

  const s = stats();
  const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'research'];

  const handleApiKeyBlur = () => {
    const trimmed = keyDraft.trim();
    setApiKey(trimmed);
  };

  return (
    <aside
      className="flex flex-col h-screen bg-[#0f0f18] border-r border-white/7 overflow-y-auto"
      style={{ width: 272 }}
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/7">
        <p className="font-mono text-[9px] text-purple-400 tracking-[3px] uppercase mb-1">// claude + remotion</p>
        <h1 className="text-[18px] font-extrabold leading-none text-white">
          Explainer <span className="text-purple-400">Studio</span>
        </h1>
      </div>

      {/* API Key */}
      <section className="px-5 py-4 border-b border-white/7">
        <label htmlFor="api-key" className="block font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase mb-2">
          Anthropic API Key
        </label>
        <div className="relative">
          <input
            id="api-key"
            type={keyVisible ? 'text' : 'password'}
            value={keyDraft}
            onChange={e => setKeyDraft(e.target.value)}
            onBlur={handleApiKeyBlur}
            placeholder="sk-ant-api03-..."
            autoComplete="off"
            spellCheck={false}
            aria-describedby="api-key-hint"
            className={[
              'w-full bg-[#16161f] font-mono text-[11px] px-3 pr-8 py-2 rounded-lg',
              'outline-none transition-colors border',
              isValidApiKey(settings.apiKey)
                ? 'border-teal-500/60 text-teal-300'
                : 'border-white/10 text-white/50 focus:border-purple-500/60',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => setKeyVisible(v => !v)}
            aria-label={keyVisible ? 'Hide API key' : 'Show API key'}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            {keyVisible ? '🙈' : '👁'}
          </button>
        </div>
        <p id="api-key-hint" className="mt-1.5 font-mono text-[9px] text-white/20">
          Stored in session only — never persisted
        </p>
      </section>

      {/* Difficulty */}
      <section className="px-5 py-4 border-b border-white/7">
        <p className="font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase mb-2">Difficulty</p>
        <div className="grid grid-cols-2 gap-1.5">
          {levels.map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              aria-pressed={settings.defaultLevel === lvl}
              className={[
                'text-[11px] font-semibold py-2 px-2 rounded-lg border transition-all text-center',
                settings.defaultLevel === lvl
                  ? 'border-purple-500/60 bg-purple-500/15 text-purple-300'
                  : 'border-white/7 bg-[#16161f] text-white/40 hover:text-white/70 hover:border-white/12',
              ].join(' ')}
            >
              {LEVEL_LABELS[lvl]}
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 py-4 border-b border-white/7">
        <p className="font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase mb-2">Progress</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: s.completed, label: 'Done',      color: 'text-teal-400' },
            { val: s.streak,    label: 'Streak',    color: 'text-amber-400' },
            { val: s.remaining, label: 'Left',      color: 'text-purple-400' },
            { val: s.total,     label: 'Total',     color: 'text-blue-400' },
          ].map(({ val, label, color }) => (
            <div key={label} className="bg-[#16161f] rounded-lg p-3">
              <div className={`text-xl font-extrabold leading-none ${color}`}>{val}</div>
              <div className="font-mono text-[9px] text-white/30 mt-1 tracking-wide">{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category coverage */}
      <section className="px-5 py-4 border-b border-white/7">
        <p className="font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase mb-2">Categories</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map(cat => {
            const done  = history.filter(h => h.completed && h.category === cat.id).length;
            const total = (cat as any).topicCount ??
              /* derive dynamically */ history.filter(h => h.category === cat.id).length;
            const pct = done > 0 ? Math.min(100, Math.round((done / 8) * 100)) : 0;
            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-white/50">{cat.label}</span>
                  <span className="font-mono text-[9px] text-white/25">{done}</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent history */}
      <section className="px-5 py-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase">Recent</p>
          {history.length > 0 && (
            <button
              onClick={() => { if (confirm('Clear all watch history?')) clearHistory(); }}
              className="font-mono text-[9px] text-red-400/60 hover:text-red-400 transition-colors"
              aria-label="Clear watch history"
            >
              clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-[11px] text-white/20">No history yet</p>
        ) : (
          <ul className="flex flex-col gap-1" role="list">
            {[...history].reverse().slice(0, 12).map(h => {
              const cat = CATEGORIES.find(c => c.id === h.category);
              return (
                <li
                  key={`${h.topicId}-${h.watchedAt}`}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-[#16161f] rounded-lg border border-white/5"
                  role="listitem"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: h.completed ? cat?.color ?? '#888' : '#333' }}
                    aria-hidden
                  />
                  <span className="text-[11px] text-white/50 flex-1 truncate" title={h.topicTitle}>
                    {h.topicTitle}
                  </span>
                  <span className="font-mono text-[9px] text-white/20">
                    {new Date(h.watchedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </aside>
  );
};
