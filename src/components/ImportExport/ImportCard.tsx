import React, { useRef, useState } from 'react';
import { NavigationItem, BatchImportProgress } from '@/types/nav';

interface ImportCardProps {
  isImporting: boolean; // 文件解析中
  isBatchImporting: boolean; // 写入 Notion 中
  importSuccess: boolean;
  importedItems: NavigationItem[] | null;
  batchProgress: BatchImportProgress | null;
  error: string | null;
  onImportFile: (file: File) => void;
  onBatchImport: () => void;
  onErrorClear: () => void;
}

export const ImportCard: React.FC<ImportCardProps> = ({
  isImporting,
  isBatchImporting,
  importSuccess,
  importedItems,
  batchProgress,
  error,
  onImportFile,
  onBatchImport,
  onErrorClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onImportFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[--accent]/30 transition-all space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-white">📥 导入数据</span>
      </div>

      {/* 拖拽上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragging
          ? 'border-[--accent] bg-[--accent]/10'
          : 'border-white/20 hover:border-[--accent]/50 hover:bg-white/5'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv,.html,.htm"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 text-center">
          {isImporting ? (
            <>
              <div className="w-8 h-8 border-2 border-[--accent] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400">正在解析文件...</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-400">
                {isDragging ? '松开以上传文件' : '点击或拖拽文件到此处'}
              </p>
              <p className="text-[10px] text-gray-600">
                支持 JSON / CSV / HTML / 浏览器书签
              </p>
            </>
          )}
        </div>
      </div>

      {/* 成功提示和批量导入按钮 */}
      {importSuccess && importedItems && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-green-400">
              文件解析成功！共 {importedItems.length} 条数据
            </span>
          </div>

          {/* 批量导入到 Notion 按钮 */}
          <button
            onClick={onBatchImport}
            disabled={isBatchImporting}
            className="w-full px-4 py-3 bg-gradient-to-r from-[--accent] to-[--secondary] text-[--primary-dark] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBatchImporting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[--primary-dark] border-t-transparent rounded-full animate-spin"></div>
                正在导入到 Notion...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                批量导入到 Notion 数据库
              </span>
            )}
          </button>

          {/* 批量导入进度 */}
          {batchProgress && (
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl space-y-3 animate-in slide-in-from-bottom-2">
              {/* 进度标题和百分比 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-blue-400">
                    {isBatchImporting ? '正在导入到 Notion...' : '导入完成'}
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-400 font-mono">
                  {Math.round((batchProgress.current / batchProgress.total) * 100)}%
                </span>
              </div>

              {/* 进度条 */}
              <div className="relative">
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[--accent] via-blue-400 to-[--secondary] transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                  >
                    {/* 动画光效 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                {/* 进度数字 */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full">
                  <span className="text-[10px] text-blue-400 font-mono bg-[#0f172a] px-2 py-0.5 rounded-full border border-blue-400/30">
                    {batchProgress.current} / {batchProgress.total}
                  </span>
                </div>
              </div>

              {/* 成功/失败/跳过 统计 */}
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-green-400 font-mono">{batchProgress.success}</span>
                  </div>
                  {batchProgress.skipped > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg" title="跳过已存在的重复项">
                      <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-yellow-400 font-mono">{batchProgress.skipped}</span>
                    </div>
                  )}
                  {batchProgress.failed > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-xs text-red-400 font-mono">{batchProgress.failed}</span>
                    </div>
                  )}
                </div>
                {!isBatchImporting && batchProgress.failed === 0 && (
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    完成
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-red-400 font-bold mb-1">导入失败</p>
            <p className="text-[10px] text-red-400/80">{error}</p>
          </div>
          <button
            onClick={onErrorClear}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}


      {/* 导入说明 */}
      <div className="space-y-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-blue-400 font-bold">📖 导入说明</p>

            {/* 支持格式 */}
            <div>
              <p className="text-[10px] text-blue-300 font-semibold mb-1">支持格式：</p>
              <ul className="text-[10px] text-blue-400/80 space-y-0.5 ml-3">
                <li>• JSON - 本应用导出的数据</li>
                <li>• CSV - 表格格式数据</li>
                <li>• HTML - 浏览器书签文件</li>
              </ul>
            </div>

            {/* 浏览器书签导出教程 */}
            <div className="pt-2 border-t border-blue-500/20">
              <p className="text-[10px] text-blue-300 font-semibold mb-1.5">📚 浏览器书签导出方法：</p>
              <div className="space-y-2">
                <div className="pl-3 border-l-2 border-blue-500/30">
                  <p className="text-[10px] text-blue-400 font-semibold">Chrome / Edge</p>
                  <p className="text-[9px] text-blue-400/70 leading-relaxed">
                    点击 ⋮ 菜单 → 书签 → 书签管理器 → 点击 ⋮ → 导出书签
                  </p>
                </div>
                <div className="pl-3 border-l-2 border-purple-500/30">
                  <p className="text-[10px] text-purple-400 font-semibold">Firefox</p>
                  <p className="text-[9px] text-purple-400/70 leading-relaxed">
                    点击 ☰ 菜单 → 书签 → 管理书签 → 导入和备份 → 导出书签为HTML
                  </p>
                </div>
                <div className="pl-3 border-l-2 border-green-500/30">
                  <p className="text-[10px] text-green-400 font-semibold">Safari</p>
                  <p className="text-[9px] text-green-400/70 leading-relaxed">
                    菜单栏 → 文件 → 导出书签
                  </p>
                </div>
              </div>
            </div>

            {/* 导入流程 */}
            <div className="pt-2 border-t border-blue-500/20">
              <p className="text-[10px] text-blue-300 font-semibold mb-1">📥 导入流程：</p>
              <ol className="text-[9px] text-blue-400/70 space-y-0.5 ml-3 list-decimal">
                <li>上传文件后，系统会自动解析数据</li>
                <li>点击"批量导入到 Notion 数据库"按钮</li>
                <li>等待导入完成，页面会自动刷新</li>
              </ol>
              <p className="text-[9px] text-yellow-400/80 mt-1.5">
                💡 提示：系统会自动跳过已存在的重复项
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
