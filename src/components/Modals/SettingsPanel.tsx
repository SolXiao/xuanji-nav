'use client';

import React, { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Icon } from '../Icon';
import { X, Settings, Database, Palette, Eye, Activity, Sliders, RefreshCw, LogOut, Check } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'notion' | 'appearance' | 'features' | 'data';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, isLoaded } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('notion');

  if (!isOpen) return null;

  const tabs = [
    { id: 'notion', label: 'Notion 连接', icon: Database },
    { id: 'appearance', label: '界面视觉', icon: Palette },
    { id: 'features', label: '功能开关', icon: Sliders },
    { id: 'data', label: '数据管理', icon: RefreshCw },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end animate-in fade-in duration-300">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 抽屉面板 */}
      <div className="relative w-full max-w-md bg-[#0f172a] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-500 overflow-hidden">
        {/* 头部 */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[--accent]/10 text-[--accent]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">璇玑设置</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">XuanJi Config</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧垂直 Tab */}
          <div className="w-20 border-r border-white/5 flex flex-col py-4 gap-2">
            {tabs.map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex flex-col items-center gap-1.5 py-4 transition-all relative group
                    ${isActive ? 'text-[--accent]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[--accent] rounded-r-full shadow-[0_0_15px_var(--accent)]"></div>
                  )}
                  <IconComp className={`w-5 h-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                  <span className="text-[10px] font-medium">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* 右侧表单区 */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
            {activeTab === 'notion' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                    <Database className="w-4 h-4 text-[--accent]" />
                    Notion 集成配置
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 ml-1">Integration Token</label>
                    <input
                      type="password"
                      placeholder="secret_..."
                      value={settings.notion.apiKey}
                      onChange={(e) => updateSettings({ notion: { ...settings.notion, apiKey: e.target.value } })}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[--accent]/40 focus:outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 ml-1">Database ID</label>
                    <input
                      type="text"
                      placeholder="输入 32 位 ID"
                      value={settings.notion.databaseId}
                      onChange={(e) => updateSettings({ notion: { ...settings.notion, databaseId: e.target.value } })}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-[--accent]/40 focus:outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <button className="w-full py-3 bg-[--accent] text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(var(--accent-rgb),0.2)]">
                  连接并探测星图
                </button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                    <Palette className="w-4 h-4 text-purple-400" />
                    个性化主题
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['dark', 'light', 'auto'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateSettings({ appearance: { ...settings.appearance, theme: mode } })}
                        className={`py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all
                          ${settings.appearance.theme === mode
                            ? 'border-[--accent] bg-[--accent]/10 text-[--accent]'
                            : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">显示描述</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ appearance: { ...settings.appearance, showDescription: !settings.appearance.showDescription } })}
                      className={`w-10 h-6 rounded-full p-1 transition-all ${settings.appearance.showDescription ? 'bg-[--accent]' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings.appearance.showDescription ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 更多 Tab 内容待后续完善 */}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono tracking-tighter">
            <span>VERSION 5.0.0-PRO</span>
            <span>XUANJI LABS © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
