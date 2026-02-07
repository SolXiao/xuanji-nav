/**
 * 链接状态接口
 */
export interface LinkStatus {
  url: string;
  isValid: boolean;
  statusCode?: number;
  error?: string;
  checkedAt: Date;
}

/**
 * 检测单个链接状态
 * @param url 要检测的URL
 * @param timeout 超时时间（毫秒），默认5000ms
 */
export async function checkLink(url: string, timeout: number = 5000): Promise<LinkStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // 使用 HEAD 请求，减少流量消耗
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors', // 避免CORS问题，但无法获取状态码
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);

    // no-cors 模式下，response.type 为 'opaque'
    // 无法获取状态码，但如果能响应就认为是有效的
    const isValid = response.type === 'opaque' || response.ok;

    return {
      url,
      isValid,
      statusCode: response.status || undefined,
      checkedAt: new Date(),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // 如果是超时，尝试用 GET 请求重试一次
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        url,
        isValid: false,
        error: '请求超时',
        checkedAt: new Date(),
      };
    }

    return {
      url,
      isValid: false,
      error: error instanceof Error ? error.message : '未知错误',
      checkedAt: new Date(),
    };
  }
}

/**
 * 批量检测链接状态
 * @param urls URL数组
 * @param onProgress 进度回调
 * @param concurrency 并发数量，默认5
 */
export async function checkLinks(
  urls: string[],
  onProgress?: (current: number, total: number, result: LinkStatus) => void,
  concurrency: number = 5
): Promise<Map<string, LinkStatus>> {
  const results = new Map<string, LinkStatus>();
  let completed = 0;

  // 分批并发检测
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(url => checkLink(url))
    );

    batchResults.forEach(result => {
      results.set(result.url, result);
      completed++;

      if (onProgress) {
        onProgress(completed, urls.length, result);
      }
    });

    // 每批次之间延迟，避免触发限流
    if (i + concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

/**
 * 使用服务端API检测链接（绕过CORS限制）
 */
export async function checkLinkViaAPI(url: string): Promise<LinkStatus> {
  try {
    const response = await fetch('/api/check-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('API检测失败');
    }

    const data = await response.json();
    return {
      url,
      isValid: data.isValid,
      statusCode: data.statusCode,
      error: data.error,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      url,
      isValid: false,
      error: error instanceof Error ? error.message : 'API调用失败',
      checkedAt: new Date(),
    };
  }
}
