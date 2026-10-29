'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  circle?: boolean;
}

export function Skeleton({
  width,
  height,
  borderRadius,
  circle = false,
  className = '',
  style = {},
  ...rest
}: SkeletonProps) {
  const dynamicStyle: React.CSSProperties = {
    ...style,
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    borderRadius: circle ? '50%' : borderRadius || 'var(--radius-md)',
  };

  return (
    <div
      className={['skeleton-shimmer', className].filter(Boolean).join(' ')}
      style={dynamicStyle}
      aria-hidden="true"
      {...rest}
    />
  );
}
