import React from 'react';

type Variant = 'primary' | 'ghost' | 'success' | 'danger';
type Size    = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-[#7b5ea7] text-white border-white/15 hover:bg-[#9370c8] hover:shadow-lg hover:shadow-purple-900/40 hover:-translate-y-px',
  ghost:   'bg-[#1e1e2a] text-[#9490b8] border-white/7 hover:border-white/12 hover:text-white',
  success: 'bg-teal-500/15 text-teal-400 border-teal-500/30 hover:bg-teal-500/25',
  danger:  'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  size    = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center gap-2 font-bold rounded-lg border',
        'transition-all duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
        'disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" aria-hidden />
      )}
      {children}
    </button>
  );
};
