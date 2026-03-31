import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;  // hex
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#7b5ea7', className = '' }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-medium uppercase tracking-widest border ${className}`}
    style={{ color, borderColor: color + '44', background: color + '11' }}
  >
    {label}
  </span>
);
