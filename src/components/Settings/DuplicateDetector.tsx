'use client';

import React, { useState, useMemo } from 'react';
import { NavigationItem } from '@/types/nav';
import { findDuplicates, getDuplicateStats, DuplicateGroup } from '@/lib/duplicate-detector';

interface DuplicateDetectorProps {
  items: NavigationItem[];
  onDelete?: (ids: string[]) => void;
}

export const DuplicateDetector: React.FC<DuplicateDetectorProps> = ({ items, onDelete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selectedToKeep, setSelectedToKeep] = useState<Map<string, string>>(new Map());

  // 扫描重复项
  const duplicates = useMemo(() => {
    if (!scanned) return [];
    return findDuplicates(items);
  }, [items, scanned]);

  const stats = useMemo(() => {
    return getDuplicateStats(duplicates);
  }, [duplicates]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanned(true);
      setIsScanning(false);
    }, 500);
  };

  const handleSelectKeep = (groupIndex: number, itemId: string) => {
    const newSelection = new Map(selectedToKeep);
    newSelection.set(groupIndex.toString(), itemId);
    setSelectedToKeep(newSelection);
  };

  const handleDeleteDuplicates = () => {
    if (!onDelete) return;

    const idsToDelete: string[] = [];

    duplicates.forEach((group, index) => {
      const keepId = selectedToKeep.get(index.toString());

      group.items.forEach(item => {
        if (item.id !== keepId) {
          idsToDelete.push(item.id);
        }
      });
    });

    if (idsToDelete.length > 0) {
      if (confirm(`确定要删除 ${idsToDelete.length} 个重复项吗？`)) {
        onDelete(idsToDelete);
        setScanned(false);
        setSelectedToKeep(new Map());
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 标题和扫描按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">🔍 重复项检测</h3>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 transition-all disabled:opacity-50"
        >
          {isScanning ? '扫描中...' : scanned ? '重新扫描' : '开始扫描'}
        </button>
      </div>

      {/* 统计信息 */}
      {scanned && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalGroups}</div>
              <div className="text-[10px] text-gray-400">重复组</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.totalItems}</div>
              <div className="text-[10px] text-gray-400">重复项</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.canRemove}</div>
              <div className="text-[10px] text-gray-400">可删除</div>
            </div>
          </div>
        </div>
      )}

      {/* 重复项列表 */}
      {scanned && duplicates.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {duplicates.map((group, groupIndex) => (
            <div key={groupIndex} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-2">
                {group.normalizedUrl}
              </div>
              <div className="space-y-2">
                {group.items.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-all ${selectedToKeep.get(groupIndex.toString()) === item.id
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`keep-${groupIndex}`}
                      checked={selectedToKeep.get(groupIndex.toString()) === item.id}
                      onChange={() => handleSelectKeep(groupIndex, item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-gray-500">{item.category}</div>
                      <div className="text-[10px] text-gray-600 truncate">{item.url}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 批量删除按钮 */}
      {scanned && duplicates.length > 0 && (
        <button
          onClick={handleDeleteDuplicates}
          disabled={selectedToKeep.size !== duplicates.length}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedToKeep.size === duplicates.length
            ? `删除 ${stats.canRemove} 个重复项`
            : `请为每组选择保留项 (${selectedToKeep.size}/${duplicates.length})`}
        </button>
      )}

      {/* 无重复项 */}
      {scanned && duplicates.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-400">
          ✅ 未发现重复项
        </div>
      )}
    </div>
  );
};
