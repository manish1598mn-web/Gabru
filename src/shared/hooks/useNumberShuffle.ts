'use client';

import { useState, useEffect } from 'react';

export interface ShuffleItem {
  id: number;
  max?: number;
  weight?: number;
}

/**
 * Generates an active, high-frequency numeric shuffling animation while an analysis is in flight.
 * Simulates real-time computational inference feedback for the user.
 * 
 * @param isAnalyzing Whether the evaluation process is currently running
 * @param items Array of items with id and max or weight scale value
 * @param intervalMs Frequency of shuffle tick in milliseconds (default: 50ms)
 */
export function useNumberShuffle(
  isAnalyzing: boolean,
  items: ShuffleItem[],
  intervalMs: number = 50
): Record<number, number> {
  const [shuffleScores, setShuffleScores] = useState<Record<number, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAnalyzing && items.length > 0) {
      interval = setInterval(() => {
        const next: Record<number, number> = {};
        for (const item of items) {
          const limit = item.max ?? item.weight ?? 10;
          next[item.id] = Math.floor(Math.random() * (limit + 1));
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
