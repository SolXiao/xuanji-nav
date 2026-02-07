import React from 'react';
import { NavigationItem, ExportFormat } from '@/types/nav';

interface ExportCardProps {
  itemCount: number;
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
}

export const ExportCard: React.FC<ExportCardProps> = ({
  itemCount,
  format,
  onFormatChange,
  onExport,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[--accent]/30 transition-all space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-white">📤 导出数据</span>
      </div>

      <div className="flex gap-2">
        {/* 格式选择 */}
        <select
          value={format}
          onChange={(e) => onFormatChange(e.target.value as ExportFormat)}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[--accent]/50 transition-colors cursor-pointer"
        >
          <option value="json">JSON (推荐)</option>
          <option value="csv">CSV (Excel)</option>
          <option value="html">HTML (书签)</option>
        </select>

        {/* 导出按钮 */}
        <button
          onClick={onExport}
          className="px-4 py-2 bg-gradient-to-r from-[--accent] to-[--secondary] text-[--primary-dark] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95 whitespace-nowrap"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出
          </span>
        </button>
      </div>

      <p className="text-[10px] text-gray-500">
        当前共 <span className="text-[--accent] font-bold">{itemCount}</span> 条数据
      </p>
    </div>
  );
};
