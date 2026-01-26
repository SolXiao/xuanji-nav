import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  let url = '';
  try {
    const body = await request.json();
    url = body.url;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 预处理 URL
    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      targetUrl = 'https://' + url;
    }

    let response;
    let finalUrl = targetUrl;

    try {
      // 尝试 HTTPS
      response = await fetchWithTimeout(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      }, 8000);
    } catch (e: any) {
      // 如果 HTTPS 失败且当前不是 HTTP，尝试降级到 HTTP
      if (!targetUrl.startsWith('http://')) {
        const fallbackUrl = targetUrl.replace('https://', 'http://');
        try {
          response = await fetchWithTimeout(fallbackUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
          }, 8000);
          finalUrl = fallbackUrl;
        } catch (innerError) {
          throw e; // 抛出原始错误
        }
      } else {
        throw e;
      }
    }

    if (!response || !response.ok) {
      throw new Error(`无法访问该网站 (HTTP ${response?.status || 'Unknown'})`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 提取标题 (增加冗余项和清理)
    let title = $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    title = title.trim().replace(/\s+/g, ' ');

    // 提取描述
    let description = $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    description = description.trim().replace(/\s+/g, ' ');

    // 提取图标权重策略 (进一步细化)
    const iconCandidates = [
      $('link[rel="apple-touch-icon-precomposed"]').attr('href'),
      $('link[rel="apple-touch-icon"]').attr('href'),
      $('link[rel="fluid-icon"]').attr('href'),
      $('link[rel="icon"][sizes="64x64"]').attr('href'),
      $('link[rel="icon"][sizes="32x32"]').attr('href'),
      $('link[rel="icon"]').attr('href'),
      $('link[rel="shortcut icon"]').attr('href'),
      $('meta[name="msapplication-TileImage"]').attr('content'),
      $('meta[property="og:image"]').attr('content'),
    ];

    let icon = iconCandidates.find(c => !!c);

    // 回退机制：如果都没找到，尝试根目录下的 favicon.ico
    if (!icon) {
      try {
        const urlObj = new URL(finalUrl);
        icon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
      } catch {
        icon = '/favicon.ico';
      }
    }

    // 处理图标绝对路径逻辑 (增强版)
    if (icon && !/^https?:\/\//i.test(icon)) {
      try {
        const urlObj = new URL(finalUrl);
        if (icon.startsWith('//')) {
          icon = urlObj.protocol + icon;
        } else if (icon.startsWith('/')) {
          icon = `${urlObj.protocol}//${urlObj.host}${icon}`;
        } else if (!icon.includes('data:image')) {
          // 处理相对路径
          const basePath = urlObj.pathname.endsWith('/') ? urlObj.pathname : urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
          icon = new URL(icon, `${urlObj.protocol}//${urlObj.host}${basePath}`).toString();
        }
      } catch (e) {
        console.warn(`[Metadata API] Error parsing icon path (${icon}):`, e);
      }
    }

    // console.log(`[Metadata API] Success: ${finalUrl} -> [${title || 'No Title'}]`);

    return NextResponse.json({
      title: (title || url).substring(0, 100),
      description: description.substring(0, 200),
      icon: icon,
      url: finalUrl
    });

  } catch (error: any) {
    let errorMessage = '无法连接到该星系';
    let errorCode = 'FETCH_ERROR';
    const errorDetails = error.message || error.toString();

    if (error.name === 'AbortError' || errorDetails.includes('timeout')) {
      errorMessage = '信号传输超时，该星系可能处于黑洞边缘（无法访问）';
      errorCode = 'TIMEOUT';
    } else if (error.code === 'ENOTFOUND' || errorDetails.includes('getaddrinfo')) {
      errorMessage = '找不到该星系坐标，请确认星系名是否正确（域名解析失败）';
      errorCode = 'DNS_FAILED';
    } else if (error.code === 'ECONNREFUSED' || errorDetails.includes('refused')) {
      errorMessage = '星系拒绝对接（目标服务器拒绝连接）';
      errorCode = 'CONNECTION_REFUSED';
    } else if (errorDetails.includes('protocol')) {
      errorMessage = '星系通信协议不支持 (Invalid Protocol)';
      errorCode = 'INVALID_PROTOCOL';
    }

    console.error(`[Metadata API Error] ${errorCode} | URL: ${url} | Detail: ${errorDetails}`);

    return NextResponse.json(
      { error: errorMessage, code: errorCode },
      { status: 500 }
    );
  }
}

async function fetchWithTimeout(resource: string, options: any = {}, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}
