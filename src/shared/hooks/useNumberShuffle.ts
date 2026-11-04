'use client';

import { useState, useEffect } from 'react';

export interface ShuffleItem {
  id: number;
  max?: number;
  weight?: number;
}

/**
 * Progressive deterministic metric indicator hook.
 * 100% deterministic (zero Math.random).
 */
export function useNumberShuffle(
  isAnalyzing: boolean,
  items: ShuffleItem[],
  intervalMs: number = 50
): Record<number, number> {
  const [shuffleScores, setShuffleScores] = useState<Record<number, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let stepCount = 0;

    if (isAnalyzing && items.length > 0) {
      interval = setInterval(() => {
        stepCount += 1;
        const next: Record<number, number> = {};
        for (const item of items) {
          const limit = item.max ?? item.weight ?? 10;
          // Deterministic cyclic progression based on step count and parameter ID (no Math.random)
          next[item.id] = (stepCount * 7 + item.id * 11) % (limit + 1);
        }
        setShuffleScores(next);
      }, intervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing, items, intervalMs]);

  return shuffleScores;
}
