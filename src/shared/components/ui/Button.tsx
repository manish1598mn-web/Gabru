'use client';

import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // Base styling
    const baseClass = 'btn-primitive focus-ring tactile-press';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-size-${size}`;
    const widthClass = fullWidth ? 'btn-full-width' : '';
    const loadingClass = isLoading ? 'is-loading' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={[
          baseClass,
          variantClass,
          sizeClass,
          widthClass,
          loadingClass,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {isLoading && (
          <span className="btn-spinner-icon" aria-hidden="true" />
        )}
        {!isLoading && leftIcon && (
          <span className="btn-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="btn-content-label">{children}</span>
        {!isLoading && rightIcon && (
          <span className="btn-icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
