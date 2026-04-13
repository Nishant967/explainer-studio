import React from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CATEGORIES } from '../../config/curriculum';
import { isValidApiKey } from '../../services/claude';

interface ToolbarProps {
  onExport: () => void;
  onMarkDone: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExport, onMarkDone }) => {
  const {
    dailyTopic, settings, status,
    currentScript, generate, repickTopic,
  } = useAppStore();

  const cat = dailyTopic ? CATEGORIES.find(c => c.id === dailyTopic.category) : null;
  const canGenerate = !!dailyTopic && isValidApiKey(settings.apiKey) && status !== 'generating';
  const hasScript   = status === 'ready' && !!currentScript;

  return (
    <div
      className="flex items-center gap-3 px-6 py-3 bg-[#0f0f18] border-b border-white/7 flex-wrap"
      role="toolbar"
      aria-label="Main actions"
    >
      {/* Topic info */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[9px] text-white/30 tracking-[1.5px] uppercase">Today's Topic</p>
        <p className="text-base font-extrabold text-white truncate leading-tight mt-0.5">
          {dailyTopic?.title ?? 'No topic selected'}
        </p>
        <div className="flex gap-2 mt-1 flex-wrap">
          {cat && <Badge label={cat.label} color={cat.color} />}
          {dailyTopic && (
            <Badge
              label={settings.defaultLevel}
              color={{ beginner:'#4ec9a0', intermediate:'#f0c040', advanced:'#e8645a', research:'#a78bfa' }[settings.defaultLevel]}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <Button variant="ghost" size="sm" onClick={() => repickTopic()} aria-label="Pick a different topic">
        🎲 Repick
      </Button>

      <Button
        variant="primary"
        size="md"
        loading={status === 'generating'}
        disabled={!canGenerate}
        onClick={() => generate()}
        aria-label="Generate video script"
      >
        ⚡ Generate Script
      </Button>

      <Button
        variant="success"
        size="sm"
        disabled={!hasScript}
        onClick={onMarkDone}
        aria-label="Mark topic as completed"
      >
        ✓ Mark Done
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={!hasScript}
        onClick={onExport}
        aria-label="Copy script JSON to clipboard"
      >
        &lt;/&gt; Export Code
      </Button>
    </div>
  );
};
