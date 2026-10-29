'use client';

import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'glass';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      interactive = false,
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const isInteractive = interactive || variant === 'interactive';
    const variantClass = `card-${variant}`;
    const interactiveClass = isInteractive ? 'card-interactive tactile-press' : '';

    return (
      <div
        ref={ref}
        className={[
          'card-primitive',
          variantClass,
          interactiveClass,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
