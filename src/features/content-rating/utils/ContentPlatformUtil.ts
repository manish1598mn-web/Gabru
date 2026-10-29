/**
 * GABRU — CONTENT PLATFORM DETECTION UTILITY
 * 
 * Extracts and classifies social media platforms from URL inputs.
 */

import { ContentPlatform } from '../types/ContentRatingTypes';

/**
 * Detects social platform from URL string
 */
export function detectPlatformFromUrl(url: string): ContentPlatform | null {
  const clean = url.trim().toLowerCase();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('instagram.com')) return 'instagram';
  if (clean.includes('tiktok.com')) return 'tiktok';
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'x';
  if (clean.includes('linkedin.com')) return 'linkedin';
  if (clean.includes('threads.net')) return 'threads';
  if (clean.includes('facebook.com')) return 'facebook';
  return null;
}

