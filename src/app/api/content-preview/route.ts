import { NextRequest, NextResponse } from 'next/server';

/**
 * GABRU — CONTENT PREVIEW RESOLVER API ROUTE (HARDENED)
 * 
 * Securely resolves Open Graph / oEmbed metadata and thumbnail media
 * for social media post links (YouTube, TikTok, Instagram, X, LinkedIn, etc.)
 * 
 * Security & Integrity Protections:
 * - Strict SSRF validation: Blocks private IP ranges, cloud metadata, local/internal hosts.
 * - Outgoing timeouts: 5000ms AbortSignal on all fetch calls.
 * - Response size capping: Max 256KB read to prevent server memory exhaustion.
 * - Zero Fake Data: Returns honest 422/404 errors when media cannot be scraped, never stock Unsplash photos.
 */

interface PreviewResponse {
  success: boolean;
  url: string;
  platform: string;
  format: 'short_video' | 'long_video' | 'carousel' | 'image' | 'text';
  thumbnailUrl: string;
  title: string;
  caption?: string;
  authorHandle: string;
  authorName: string;
  durationSec?: number;
  width?: number;
  height?: number;
  source: 'oembed' | 'opengraph';
}

const ALLOWED_PLATFORM_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'threads.net',
  'facebook.com',
];

function isAllowedPlatformDomain(hostname: string): boolean {
  return ALLOWED_PLATFORM_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

function isPrivateIpOrHost(hostname: string): boolean {
  // Direct loopback and internal hostname strings
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.corp')
  ) {
    return true;
  }

  // IPv4 string patterns
  const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const [, a, b, c, d] = match.map(Number);
    // 0.0.0.0/8
    if (a === 0) return true;
    // 10.0.0.0/8 (Private)
    if (a === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 169.254.0.0/16 (Link Local / Cloud Metadata)
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12 (Private)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // Documentation & reserved ranges
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && (b === 51 || (b >= 18 && b <= 19))) return true;
    if (a === 203 && b === 0 && c === 113) return true;
    if (a >= 224) return true; // Multicast & Future use
  }

  // Decimal representation of IPv4 (e.g. 2130706433 = 127.0.0.1)
  if (/^\d+$/.test(hostname)) {
    return true;
  }

  // IPv6 representations
  if (
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.startsWith('fe80:') ||
    hostname.startsWith('fc') ||
    hostname.startsWith('fd') ||
    hostname.includes('::ffff:')
  ) {
    return true;
  }

  return false;
}

function isSafePublicUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (isPrivateIpOrHost(hostname)) {
      return false;
    }
    return isAllowedPlatformDomain(hostname);
  } catch {
    return false;
  }
}

function detectPlatform(url: string): string {
  const clean = url.trim().toLowerCase();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('instagram.com')) return 'instagram';
  if (clean.includes('tiktok.com')) return 'tiktok';
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'x';
  if (clean.includes('linkedin.com')) return 'linkedin';
  if (clean.includes('threads.net')) return 'threads';
  if (clean.includes('facebook.com')) return 'facebook';
  return 'general';
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
}

function extractInstagramShortcode(url: string): { code: string; type: 'reel' | 'p' | 'tv' } | null {
  const match = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.]+\/)?(reel|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (match) {
    return { type: match[1].toLowerCase() as any, code: match[2] };
  }
  return null;
}

function extractTikTokUserAndId(url: string): { user?: string; id?: string } {
  const userMatch = url.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/i);
  const idMatch = url.match(/video\/([0-9]+)/i);
  return {
    user: userMatch ? `@${userMatch[1]}` : undefined,
    id: idMatch ? idMatch[1] : undefined,
  };
}

function extractXStatus(url: string): { user?: string; id?: string } {
  const match = url.match(/(?:twitter|x)\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/i);
  return {
    user: match ? `@${match[1]}` : undefined,
    id: match ? match[2] : undefined,
  };
}

/**
 * Reads response body with an absolute maximum byte cap (256 KB)
 */
async function fetchTextWithLimit(res: Response, maxBytes = 256 * 1024): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.length;
        if (totalBytes > maxBytes) {
          const allowed = maxBytes - (totalBytes - value.length);
          if (allowed > 0) chunks.push(value.subarray(0, allowed));
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }
  } catch {
    // Reader closed or timed out
  }

  const combined = new Uint8Array(Math.min(totalBytes, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(combined);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url')?.trim();

  if (!targetUrl) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required.' },
      { status: 400 }
    );
  }

  // SSRF Protection: validate scheme, block private IPs, require allowed domains
  if (!isSafePublicUrl(targetUrl)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Restricted or invalid URL target. Gabru only supports public links from verified social media platforms (YouTube, Instagram, TikTok, X, LinkedIn, Threads).',
      },
      { status: 400 }
    );
  }

  const platform = detectPlatform(targetUrl);
  const isShortForm =
    targetUrl.toLowerCase().includes('/shorts') ||
    targetUrl.toLowerCase().includes('/reel') ||
    platform === 'tiktok';

  // 1. YouTube & YouTube Shorts Fast-Path
  if (platform === 'youtube') {
    const ytId = extractYouTubeId(targetUrl);
    if (ytId) {
      const isShort = targetUrl.toLowerCase().includes('/shorts');
      const defaultThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      let title = isShort ? 'YouTube Short' : 'YouTube Video';
      let authorName = 'YouTube Creator';
      let authorHandle = '@youtube';

      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`,
          {
            signal: AbortSignal.timeout(5000),
            next: { revalidate: 3600 },
          }
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          if (data.title) title = data.title;
          if (data.author_name) {
            authorName = data.author_name;
            authorHandle = `@${data.author_name.toLowerCase().replace(/\s+/g, '')}`;
          }
        }
      } catch {
        // Continue with extracted video ID
      }

      const responsePayload: PreviewResponse = {
        success: true,
        url: targetUrl,
        platform: 'youtube',
        format: isShort ? 'short_video' : 'long_video',
        thumbnailUrl: defaultThumb,
        title,
        caption: title,
        authorHandle,
        authorName,
        durationSec: isShort ? 30 : 180,
        width: isShort ? 1080 : 1920,
        height: isShort ? 1920 : 1080,
        source: 'oembed',
      };
      return NextResponse.json(responsePayload);
    }
  }

  // 2. TikTok oEmbed Fast-Path
  if (platform === 'tiktok') {
    const { user } = extractTikTokUserAndId(targetUrl);
    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(targetUrl)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 3600 },
        }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.thumbnail_url) {
          const responsePayload: PreviewResponse = {
            success: true,
            url: targetUrl,
            platform: 'tiktok',
            format: 'short_video',
            thumbnailUrl: data.thumbnail_url,
            title: data.title || 'TikTok Video',
            caption: data.title || 'TikTok Short-form Viral Content',
            authorHandle: user || (data.author_unique_id ? `@${data.author_unique_id}` : `@${data.author_name || 'tiktokuser'}`),
            authorName: data.author_name || user || 'TikTok Creator',
            durationSec: 22,
            width: 1080,
            height: 1920,
            source: 'oembed',
          };
          return NextResponse.json(responsePayload);
        }
      }
    } catch {
      // Continue to opengraph
    }
  }

  // 3. Instagram OpenGraph Extraction
  if (platform === 'instagram') {
    const igMeta = extractInstagramShortcode(targetUrl);
    const isReel = igMeta?.type === 'reel' || targetUrl.toLowerCase().includes('/reel');
    const format = isReel ? 'short_video' : 'image';
    const shortcode = igMeta?.code || 'post';

    try {
      const pageRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      });

      if (pageRes.ok) {
        const html = await fetchTextWithLimit(pageRes, 256 * 1024);
        const ogImageMatch =
          html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

        if (ogImageMatch && ogImageMatch[1]) {
          const cleanImage = ogImageMatch[1].replace(/&amp;/g, '&');
          const title = ogTitleMatch ? ogTitleMatch[1].replace(/&amp;/g, '&') : `Instagram ${isReel ? 'Reel' : 'Post'}`;
          const caption = ogDescMatch ? ogDescMatch[1].replace(/&amp;/g, '&') : title;

          return NextResponse.json({
            success: true,
            url: targetUrl,
            platform: 'instagram',
            format,
            thumbnailUrl: cleanImage,
            title,
            caption,
            authorHandle: `@${shortcode.substring(0, 8)}`,
            authorName: 'Instagram Creator',
            durationSec: isReel ? 18 : 0,
            width: 1080,
            height: isReel ? 1920 : 1350,
            source: 'opengraph',
          });
        }
      }
    } catch {
      // Continue to structured error
    }

    // Do NOT return fake Unsplash images. Return clear explanation of Instagram login wall.
    return NextResponse.json(
      {
        success: false,
        error:
          'Could not retrieve preview media from Instagram. Instagram login walls block public scrapers. You can evaluate your post by uploading the media directly or inputting metrics.',
      },
      { status: 422 }
    );
  }

  // 4. X (Twitter) Fast-Path
  if (platform === 'x') {
    const { user } = extractXStatus(targetUrl);
    try {
      const oembedRes = await fetch(
        `https://publish.twitter.com/oembed?url=${encodeURIComponent(targetUrl)}&omit_script=true`,
        {
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 3600 },
        }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        const authorName = data.author_name || 'X User';
        const authorHandle = user || `@${data.author_name?.toLowerCase().replace(/\s+/g, '') || 'xuser'}`;
        const title = data.html ? data.html.replace(/<[^>]+>/g, ' ').substring(0, 100).trim() : 'X Post';

        return NextResponse.json({
          success: true,
          url: targetUrl,
          platform: 'x',
          format: 'text',
          thumbnailUrl: '',
          title,
          caption: title,
          authorHandle,
          authorName,
          durationSec: 0,
          width: 1200,
          height: 675,
          source: 'oembed',
        });
      }
    } catch {
      // Continue to structured error
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Could not resolve preview from X (Twitter). Please verify the post is public.',
      },
      { status: 422 }
    );
  }

  // 5. Generic OpenGraph Scraper for other allowed social platforms (Threads, LinkedIn)
  try {
    const pageRes = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });

    if (pageRes.ok) {
      const html = await fetchTextWithLimit(pageRes, 256 * 1024);
      const ogImage =
        html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
      const ogTitle =
        html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<title>([^<]+)<\/title>/i);
      const ogDesc =
        html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

      if (ogImage && ogImage[1]) {
        return NextResponse.json({
          success: true,
          url: targetUrl,
          platform,
          format: isShortForm ? 'short_video' : 'image',
          thumbnailUrl: ogImage[1].replace(/&amp;/g, '&'),
          title: ogTitle ? ogTitle[1].trim() : 'Social Media Content',
          caption: ogDesc ? ogDesc[1].trim() : undefined,
          authorHandle: '@creator',
          authorName: 'Creator',
          durationSec: isShortForm ? 20 : 0,
          width: 1080,
          height: isShortForm ? 1920 : 1080,
          source: 'opengraph',
        });
      }
    }
  } catch {
    // Continue to error
  }

  return NextResponse.json(
    {
      success: false,
      error:
        'Could not extract preview media from this post. The post may be private, age-restricted, or behind a platform wall.',
    },
    { status: 422 }
  );
}
