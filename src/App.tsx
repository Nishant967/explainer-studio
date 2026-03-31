import React, { useCallback, useEffect } from 'react';
import { Sidebar }      from './components/panels/Sidebar';
import { Toolbar }      from './components/panels/Toolbar';
import { VideoPreview } from './components/canvas/VideoPreview';
import { ScenePanel }   from './components/panels/ScenePanel';
import { StatusBar }    from './components/panels/StatusBar';
import { useToast }     from './components/ui/Toast';
import { useAppStore }  from './hooks/useAppStore';
import { generateRemotionCode } from './services/codeExporter';

export const App: React.FC = () => {
  const { currentScript, dailyTopic, markCompleted, setActiveScene } = useAppStore();
  const { show, ToastContainer } = useToast();

  // ── Keyboard shortcuts ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveScene(useAppStore.getState().activeScene + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveScene(useAppStore.getState().activeScene - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActiveScene]);

  // ── Export handler ───────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (!currentScript) return;
    const code = generateRemotionCode(currentScript);
    navigator.clipboard.writeText(code)
      .then(() => show('Remotion code copied to clipboard!', 'success'))
      .catch(() => show('Clipboard write failed — check browser permissions', 'error'));
  }, [currentScript, show]);

  // ── Mark done handler ────────────────────────────────────────────
  const handleMarkDone = useCallback(() => {
    if (!dailyTopic) return;
    markCompleted(dailyTopic.id);
    show(`"${dailyTopic.title}" marked as complete!`, 'success');
  }, [dailyTopic, markCompleted, show]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#08080e] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Toolbar onExport={handleExport} onMarkDone={handleMarkDone} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <VideoPreview />
          <ScenePanel />
        </div>
        <StatusBar />
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};
