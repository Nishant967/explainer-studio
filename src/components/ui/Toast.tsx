import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type:    ToastType;
  onDismiss: () => void;
}

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'border-teal-500/40 text-teal-400',
  error:   'border-red-500/40 text-red-400',
  info:    'border-purple-500/40 text-purple-300',
};

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border',
        'bg-[#1e1e2a] font-semibold text-sm max-w-xs',
        'transition-all duration-300',
        TYPE_STYLES[type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
    >
      {message}
    </div>
  );
};

// ── useToast hook ─────────────────────────────────────────────────
interface ToastEntry { id: number; message: string; type: ToastType; }

export function useToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  let nextId = 0;

  const show = (message: string, type: ToastType = 'info') => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const ToastContainer = () => (
    <>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />
      ))}
    </>
  );

  return { show, ToastContainer };
}
