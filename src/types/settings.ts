export type LayoutMode = 'grid' | 'list' | 'compact';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface UserSettings {
  appearance: {
    theme: ThemeMode;
    accentColor: string;
    layout: LayoutMode;
    cardsPerRow: number;
    showDescription: boolean;
    animations: boolean;
    neonGlow: boolean; // 璇玑 5.0 特色霓虹效果
  };
  behavior: {
    openInNewTab: boolean;
    searchFocus: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // 分钟
  };
  notion: {
    apiKey: string;
    databaseId: string;
    lastSync?: string;
    isConnected: boolean;
  };
  features: {
    analytics: boolean;
    offlineMode: boolean;
    searchHistory: boolean;
    quickAdd: boolean;
    clockWidget: boolean;
    scrollSpy: boolean;
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  appearance: {
    theme: 'dark',
    accentColor: '#ffd700',
    layout: 'grid',
    cardsPerRow: 4,
    showDescription: true,
    animations: true,
    neonGlow: true,
  },
  behavior: {
    openInNewTab: true,
    searchFocus: true,
    autoRefresh: false,
    refreshInterval: 5,
  },
  notion: {
    apiKey: '',
    databaseId: '',
    isConnected: false,
  },
  features: {
    analytics: true,
    offlineMode: true,
    searchHistory: true,
    quickAdd: true,
    clockWidget: true,
    scrollSpy: true,
  },
};
