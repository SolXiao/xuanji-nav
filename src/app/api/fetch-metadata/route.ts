import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    // 智能获取 Favicon
    let icon = $('link[rel="apple-touch-icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href') || '';

    if (icon && !icon.startsWith('http')) {
      const urlObj = new URL(url);
      icon = `${urlObj.protocol}//${urlObj.host}${icon.startsWith('/') ? '' : '/'}${icon}`;
    }

    // 兜底方案：使用 Google Favicon API
    if (!icon) {
      const urlObj = new URL(url);
      icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
    }

    return NextResponse.json({
      title: title.trim(),
      description: description.trim(),
      icon
    });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
