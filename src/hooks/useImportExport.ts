import { useState, useCallback } from 'react';
import { NavigationItem, BatchImportProgress, ExportFormat } from '@/types/nav';
import {
  exportToJSON,
  exportToCSV,
  exportToHTML,
  importFile,
} from '@/lib/import-utils';

interface UseImportExportProps {
  items: NavigationItem[]; // 当前数据库中的数据，用于去重
  onImportSuccess?: (items: NavigationItem[]) => void;
}

export const useImportExport = ({ items, onImportSuccess }: UseImportExportProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [isImporting, setIsImporting] = useState(false); // 文件解析状态
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false); // 文件解析成功状态
  const [importedItems, setImportedItems] = useState<NavigationItem[] | null>(null);

  const [isBatchImporting, setIsBatchImporting] = useState(false); // 批量导入 Notion 状态
  const [batchProgress, setBatchProgress] = useState<BatchImportProgress | null>(null);

  // 1. 导出逻辑
  const handleExport = useCallback(() => {
    try {
      switch (exportFormat) {
        case 'json':
          exportToJSON(items);
          break;
        case 'csv':
          exportToCSV(items);
          break;
        case 'html':
          exportToHTML(items);
          break;
      }
    } catch (error) {
      console.error('导出失败:', error);
    }
  }, [exportFormat, items]);

  // 2. 文件导入逻辑 (解析文件)
  const handleImportFile = useCallback(async (file: File) => {
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportedItems(null);

    try {
      const parsedItems = await importFile(file);

      // 将解析的数据缓存到 IndexedDB
      try {
        const dbName = 'xuanji-nav-import-cache';
        const storeName = 'pending-imports';

        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);

          // 清除旧缓存
          store.clear();

          // 存储新数据
          parsedItems.forEach(item => {
            store.put(item);
          });

          console.log(`已缓存 ${parsedItems.length} 条数据到 IndexedDB`);
        };
      } catch (cacheError) {
        console.warn('缓存数据失败:', cacheError);
        // 缓存失败不影响主流程
      }

      // 保存导入的数据
      setImportedItems(parsedItems);
      setImportSuccess(true);

      // 调用回调函数（用于本地预览或其他副作用）
      if (onImportSuccess) {
        onImportSuccess(parsedItems);
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入失败');
    } finally {
      setIsImporting(false);
    }
  }, [onImportSuccess]);

  // 3. 批量导入到 Notion 逻辑 (包含去重)
  const handleBatchImportToNotion = useCallback(async () => {
    if (!importedItems || importedItems.length === 0) {
      return;
    }

    setIsBatchImporting(true);
    setBatchProgress({ current: 0, total: importedItems.length, success: 0, failed: 0, skipped: 0 });
    setImportError(null);

    try {
      // 移除 id 字段（Notion 会自动生成）
      const itemsToImport = importedItems.map(({ id, ...rest }) => rest);

      // 创建 URL 集合用于快速检查重复 (基于当前数据库 items)
      const existingUrls = new Set(items.map(item => {
        try {
          // 标准化 URL 以提高匹配率 (移除末尾斜杠, 转小写)
          return new URL(item.url || '').href.replace(/\/$/, '').toLowerCase();
        } catch {
          return (item.url || '').toLowerCase();
        }
      }));

      let successCount = 0;
      let failedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // 逐项导入, 实时更新进度
      for (let i = 0; i < itemsToImport.length; i++) {
        const currentItem = itemsToImport[i];
        let isDuplicate = false;

        try {
          const currentUrl = new URL(currentItem.url || '').href.replace(/\/$/, '').toLowerCase();
          if (existingUrls.has(currentUrl)) {
            isDuplicate = true;
          }
        } catch {
          if (existingUrls.has((currentItem.url || '').toLowerCase())) {
            isDuplicate = true;
          }
        }

        if (isDuplicate) {
          skippedCount++;
        } else {
          try {
            const response = await fetch('/api/notion/add-item', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(currentItem),
            });

            if (response.ok) {
              successCount++;
            } else {
              failedCount++;
              const result = await response.json();
              errors.push(`${currentItem.title}: ${result.error || '未知错误'}`);
            }
          } catch (error) {
            failedCount++;
            errors.push(`${currentItem.title}: ${error instanceof Error ? error.message : '网络错误'}`);
          }
        }

        // 实时更新进度
        setBatchProgress({
          current: i + 1,
          total: itemsToImport.length,
          success: successCount,
          failed: failedCount,
          skipped: skippedCount
        });

        // 只有在真正请求时才需要延迟 (300ms)
        if (!isDuplicate && i < itemsToImport.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // 显示结果
      if (failedCount > 0) {
        setImportError(`导入完成：成功 ${successCount} 条，跳过 ${skippedCount} 条，失败 ${failedCount} 条\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? `\n...还有 ${errors.length - 3} 个错误` : ''}`);
      } else {
        // 全部成功
        setImportSuccess(true);
        setImportError(null);

        // 3秒后清除状态并刷新页面
        setTimeout(() => {
          setImportedItems(null);
          setBatchProgress(null);
          setImportSuccess(false);
          window.location.reload(); // 刷新页面以显示新数据
        }, 3000);
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '批量导入到 Notion 失败');
      setBatchProgress(null);
    } finally {
      setIsBatchImporting(false);
    }
  }, [importedItems, items]);

  return {
    exportFormat,
    setExportFormat,
    isImporting,
    importError,
    setImportError,
    importSuccess,
    importedItems,
    isBatchImporting,
    batchProgress,
    handleExport,
    handleImportFile,
    handleBatchImportToNotion,
  };
};
