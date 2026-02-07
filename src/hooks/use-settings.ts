'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';

const STORAGE_KEY = 'xuanji_settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始化加载
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 合并默认设置以兼容旧版本
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
          behavior: { ...DEFAULT_SETTINGS.behavior, ...parsed.behavior },
          notion: { ...DEFAULT_SETTINGS.notion, ...parsed.notion },
          features: { ...DEFAULT_SETTINGS.features, ...parsed.features },
        });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 更新设置并持久化
  const updateSettings = useCallback((newSettings: Partial<UserSettings> | ((prev: UserSettings) => UserSettings)) => {
    setSettings(prev => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : {
        ...prev,
        ...newSettings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 重置设置
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { settings, updateSettings, resetSettings, isLoaded };
}
