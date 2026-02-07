'use client';

import React, { useState } from 'react';
import { NavigationItem } from '@/types/nav';
import { useLinkChecker } from '@/hooks/useLinkChecker';
import { LinkStatus } from '@/lib/link-checker';

interface LinkCheckerProps {
  items: NavigationItem[];
  onUpdate?: (updates: Array<{ id: string; status: string }>) => void;
}

export const LinkChecker: React.FC<LinkCheckerProps> = ({ items, onUpdate }) => {
  const { checkAllLinks, isChecking, progress, results, reset } = useLinkChecker();
  const [checked, setChecked] = useState(false);

  const handleCheck = async () => {
    setChecked(false);
    await checkAllLinks(items);
    setChecked(true);
  };

  const invalidLinks = Array.from(results.values()).filter(r => !r.isValid);

  const handleDeleteInvalid = () => {
    if (!onUpdate) return;

    const invalidIds = items
      .filter(item => {
        const result = results.get(item.url);
        return result && !result.isValid;
      })
      .map(item => item.id);

    if (invalidIds.length > 0) {
      if (confirm(`确定要删除 ${invalidIds.length} 个失效链接吗？`)) {
        // 这里应该调用删除API
        console.log('删除失效链接:', invalidIds);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 标题和检测按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">🔗 失效链接检测</h3>
        <button
          onClick={handleCheck}
          disabled={isChecking}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition-all disabled:opacity-50"
        >
          {isChecking ? '检测中...' : checked ? '重新检测' : '开始检测'}
        </button>
      </div>

      {/* 进度条 */}
      {isChecking && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>检测进度</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green-400">✓ {progress.valid} 正常</span>
            <span className="text-red-400">✗ {progress.invalid} 失效</span>
          </div>
        </div>
      )}

      {/* 检测结果统计 */}
      {checked && !isChecking && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{progress.valid}</div>
              <div className="text-[10px] text-gray-400">正常链接</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{progress.invalid}</div>
              <div className="text-[10px] text-gray-400">失效链接</div>
            </div>
          </div>
        </div>
      )}

      {/* 失效链接列表 */}
      {checked && !isChecking && invalidLinks.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          <div className="text-xs font-medium text-gray-400">失效链接列表：</div>
          {invalidLinks.map((link, index) => {
            const item = items.find(i => i.url === link.url);
            return (
              <div key={index} className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                <div className="text-xs font-medium text-white">{item?.title || '未知'}</div>
                <div className="text-[10px] text-gray-500 truncate">{link.url}</div>
                <div className="text-[10px] text-red-400 mt-1">
                  {link.error || `状态码: ${link.statusCode}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 操作按钮 */}
      {checked && !isChecking && invalidLinks.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={handleDeleteInvalid}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all"
          >
            删除所有失效链接
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 transition-all"
          >
            清除结果
          </button>
        </div>
      )}

      {/* 无失效链接 */}
      {checked && !isChecking && invalidLinks.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-400">
          ✅ 所有链接都正常
        </div>
      )}

      {/* 提示 */}
      <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
        <p className="text-[10px] text-yellow-400/80">
          💡 <strong>提示:</strong> 由于浏览器CORS限制，部分链接可能无法准确检测。建议手动验证标记为失效的链接。
        </p>
      </div>
    </div>
  );
};
