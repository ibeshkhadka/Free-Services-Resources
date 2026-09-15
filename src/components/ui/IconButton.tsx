import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible name (buttons are icon-only) */
  label: string;
  /** 'default' neutral, 'accent' selected/primary, 'sienna' favorite, 'danger' destructive */
  tone?: 'default' | 'accent' | 'sienna' | 'danger';
  size?: 'sm' | 'md';
}

const toneClasses: Record<NonNullable<IconButtonProps['tone']>, string> = {
  default: 'border-transparent text-ink-3 hover:text-ink hover:bg-surface hover:border-hairline',
  accent: 'border-transparent bg-accent-soft text-accent hover:bg-accent hover:text-on-accent',
  sienna: 'border-transparent text-sienna hover:bg-sienna-soft',
  danger: 'border-transparent text-danger hover:bg-danger-soft',
};

/** Icon-only button with default/hover/active/focus/disabled states. */
export const IconButton: React.FC<IconButtonProps> = ({
  label,
  tone = 'default',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={`inline-flex items-center justify-center shrink-0 rounded-md border transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none ${
      size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
    } ${toneClasses[tone]} ${className}`}
    {...props}
  />
);
