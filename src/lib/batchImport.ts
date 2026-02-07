import { validateNavigationItems } from '@/lib/import-utils';
import { NavigationItem } from '@/types/nav';
import { addItem } from '@/lib/notion';

/**
 * 批量添加导航项到 Notion
 * 支持并发控制，避免 API 限流
 */
export async function batchAddItems(
  items: Omit<NavigationItem, 'id'>[],
  options?: {
    concurrency?: number; // 并发数，默认 3
    onProgress?: (current: number, total: number) => void; // 进度回调
    onError?: (item: Omit<NavigationItem, 'id'>, error: Error) => void; // 错误回调
  }
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ item: Omit<NavigationItem, 'id'>; error: string }>;
}> {
  const concurrency = options?.concurrency || 3;
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ item: Omit<NavigationItem, 'id'>; error: string }>,
  };

  // 分批处理
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);

    // 并发执行当前批次
    const promises = batch.map(async (item) => {
      try {
        await addItem(item);
        results.success++;

        // 调用进度回调
        if (options?.onProgress) {
          options.onProgress(results.success + results.failed, items.length);
        }
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        results.errors.push({ item, error: errorMessage });

        // 调用错误回调
        if (options?.onError) {
          options.onError(item, error instanceof Error ? error : new Error(errorMessage));
        }

        // 调用进度回调
        if (options?.onProgress) {
          options.onProgress(results.success + results.failed, items.length);
        }
      }
    });

    // 等待当前批次完成
    await Promise.all(promises);

    // 批次之间添加延迟，避免 API 限流
    if (i + concurrency < items.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}
