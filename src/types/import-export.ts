export type ExportFormat = 'json' | 'csv' | 'html';

export interface BatchImportProgress {
  current: number;
  total: number;
  success: number;
  failed: number;
  skipped: number;
}
