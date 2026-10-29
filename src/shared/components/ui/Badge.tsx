'use client';

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'accent';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  tabular?: boolean;
  dot?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  tabular = false,
  dot = false,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-size-${size}`;
  const tabularClass = tabular ? 'font-tabular-nums' : '';

  return (
    <span
      className={[
        'badge-primitive',
        variantClass,
        sizeClass,
        tabularClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {dot && <span className="badge-status-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
