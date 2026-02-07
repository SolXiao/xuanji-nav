'use client';

import React from 'react';
import { NavigationItem } from '@/types/nav';
import { useImportExport } from '@/hooks/useImportExport';
import { ExportCard } from '@/components/ImportExport/ExportCard';
import { ImportCard } from '@/components/ImportExport/ImportCard';

interface ImportExportSectionProps {
  items: NavigationItem[];
  onImportSuccess?: (items: NavigationItem[]) => void;
}

export const ImportExportSection: React.FC<ImportExportSectionProps> = ({
  items = [],
  onImportSuccess,
}) => {
  const {
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
  } = useImportExport({ items, onImportSuccess });

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
          数据传输
        </span>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <ExportCard
        itemCount={items.length}
        format={exportFormat}
        onFormatChange={setExportFormat}
        onExport={handleExport}
      />

      <ImportCard
        isImporting={isImporting}
        isBatchImporting={isBatchImporting}
        importSuccess={importSuccess}
        importedItems={importedItems}
        batchProgress={batchProgress}
        error={importError}
        onImportFile={handleImportFile}
        onBatchImport={handleBatchImportToNotion}
        onErrorClear={() => setImportError(null)}
      />
    </section>
  );
};
