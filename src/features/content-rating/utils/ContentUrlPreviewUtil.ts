/**
 * GABRU — CONTENT URL PREVIEW UTILITY
 * 
 * Resolves post preview images (thumbnails), titles, author handles, and formats
 * from social URLs (YouTube, Instagram, TikTok, X, etc.)
 */

import { ContentFormat, ContentPlatform } from '../types/ContentRatingTypes';
import { detectPlatformFromUrl } from './ContentPlatformUtil';

export interface ContentPreviewData {
  url: string;
  platform: ContentPlatform;
  format: ContentFormat;
  thumbnailUrl: string;
  title: string;
  caption?: string;
  authorHandle: string;
  authorName: string;
  durationSec?: number;
  width?: number;
  height?: number;
}

// In-memory cache to prevent repeated fetches for the same URL
const previewCache = new Map<string, ContentPreviewData>();

/**
 * Extracts immediate client-side heuristics (e.g. YouTube video ID)
 * so thumbnails can display with 0ms latency even before network completes.
 */
export function getFastClientPreview(url: string): ContentPreviewData | null {
  const clean = url.trim();
  const platform = detectPlatformFromUrl(clean);
  if (!platform) return null;

  // 1. YouTube & Shorts instant extraction
  if (platform === 'youtube') {
    const match = clean.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) {
      const videoId = match[1];
      const isShort = clean.toLowerCase().includes('/shorts/');
      return {
        url: clean,
        platform: 'youtube',
        format: isShort ? 'short_video' : 'long_video',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        title: isShort ? 'YouTube Short' : 'YouTube Video',
        authorHandle: '@youtube',
        authorName: 'YouTube Creator',
        durationSec: isShort ? 30 : 180,
        width: isShort ? 1080 : 1920,
        height: isShort ? 1920 : 1080,
      };
    }
  }

  // 2. Instagram shortcode heuristic
  if (platform === 'instagram') {
    const match = clean.match(/instagram\.com\/(?:[a-zA-Z0-9_.]+\/)?(reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
    const isReel = match ? match[1].toLowerCase() === 'reel' : clean.includes('/reel');
    const shortcode = match ? match[2] : 'post';
    return {
      url: clean,
      platform: 'instagram',
      format: isReel ? 'short_video' : 'image',
      thumbnailUrl: '',
      title: `Instagram ${isReel ? 'Reel' : 'Post'}`,
      authorHandle: `@creator_${shortcode.substring(0, 6)}`,
      authorName: 'Instagram Creator',
      durationSec: isReel ? 18 : 0,
      width: 1080,
      height: isReel ? 1920 : 1350,
    };
  }

  // 3. TikTok heuristic
  if (platform === 'tiktok') {
    const userMatch = clean.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/i);
    const user = userMatch ? `@${userMatch[1]}` : '@tiktokuser';
    return {
      url: clean,
      platform: 'tiktok',
      format: 'short_video',
      thumbnailUrl: '',
      title: 'TikTok Video',
      authorHandle: user,
      authorName: user.replace('@', ''),
      durationSec: 22,
      width: 1080,
      height: 1920,
    };
  }

  // 4. X (Twitter) heuristic
  if (platform === 'x') {
    const userMatch = clean.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/i);
    const user = userMatch ? `@${userMatch[1]}` : '@xcreator';
    return {
      url: clean,
      platform: 'x',
      format: 'text',
      thumbnailUrl: '',
      title: `Post by ${user}`,
      authorHandle: user,
      authorName: user.replace('@', ''),
      durationSec: 0,
      width: 1200,
      height: 675,
    };
  }

  return null;
}

/**
 * Fetches high-fidelity preview image & metadata from backend resolver route.
 */
export async function fetchUrlPreview(url: string): Promise<ContentPreviewData> {
  const cleanUrl = url.trim();
  if (previewCache.has(cleanUrl)) {
    return previewCache.get(cleanUrl)!;
  }

  // Fallback heuristic if network fails
  const fastFallback = getFastClientPreview(cleanUrl);

  try {
    const res = await fetch(`/api/content-preview?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.thumbnailUrl) {
        const preview: ContentPreviewData = {
          url: cleanUrl,
          platform: (data.platform || detectPlatformFromUrl(cleanUrl) || 'instagram') as ContentPlatform,
          format: (data.format || (cleanUrl.includes('/shorts') || cleanUrl.includes('/reel') ? 'short_video' : 'image')) as ContentFormat,
          thumbnailUrl: data.thumbnailUrl,
          title: data.title || fastFallback?.title || 'Social Media Post',
          caption: data.caption || fastFallback?.caption,
          authorHandle: data.authorHandle || fastFallback?.authorHandle || '@creator',
          authorName: data.authorName || fastFallback?.authorName || 'Creator',
          durationSec: data.durationSec ?? fastFallback?.durationSec,
          width: data.width || fastFallback?.width,
          height: data.height || fastFallback?.height,
        };
        previewCache.set(cleanUrl, preview);
        return preview;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch content preview via API, using client heuristic:', err);
  }

  if (fastFallback) {
    previewCache.set(cleanUrl, fastFallback);
    return fastFallback;
  }

  const defaultPreview: ContentPreviewData = {
    url: cleanUrl,
    platform: 'instagram',
    format: 'short_video',
    thumbnailUrl: '',
    title: 'Social Media Post',
    authorHandle: '@creator',
    authorName: 'Creator',
  };
  previewCache.set(cleanUrl, defaultPreview);
  return defaultPreview;
}

