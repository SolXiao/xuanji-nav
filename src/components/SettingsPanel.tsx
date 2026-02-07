'use client';

import React, { useState } from 'react';
import NetworkStatus from './NetworkStatus';
import { NavigationItem } from '@/types/nav';
import { ImportExportSection } from './ImportExportSection';
import { StatsPanel } from './StatsPanel';
import { DuplicateDetector } from './Settings/DuplicateDetector';
import { LinkChecker } from './Settings/LinkChecker';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
}

type TabType = 'stats' | 'data' | 'manage' | 'system';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, items }) => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  const tabs = [
    { id: 'stats' as TabType, label: '数据中心', icon: '📊' },
    { id: 'data' as TabType, label: '数据传输', icon: '📥' },
    { id: 'manage' as TabType, label: '数据管理', icon: '🔧' },
    { id: 'system' as TabType, label: '系统设置', icon: '⚙️' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[80] w-full max-w-lg bg-[#0f172a]/95 backdrop-blur-3xl border-l border-white/5 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col relative">

          {/* Decorative Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[--accent]/10 to-transparent pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10 pt-8 pb-4 px-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-[--accent]">⚙️</span>
                  星盘设置
                </h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">System Configuration</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-[--accent] text-white shadow-lg shadow-[--accent]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 py-6">
            {activeTab === 'stats' && (
              <div className="space-y-4 animate-fade-in">
                <StatsPanel items={items} />
              </div>
            )}

            {activeTab === 'data' && (
              <div className="animate-fade-in">
                <ImportExportSection items={items} />
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="space-y-6 animate-fade-in">
                <DuplicateDetector items={items} />
                <LinkChecker items={items} />
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4 animate-fade-in">
                {/* Network Section */}
                <div className="space-y-4">
                  <SectionHeader title="实时通讯" />
                  <NetworkStatus />
                </div>

                {/* System Info */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[--accent]/5 to-transparent border border-[--accent]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse"></div>
                    <h4 className="text-xs font-bold text-[--accent] uppercase tracking-wider">System Status</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                    PROTOCOL: V2.0.4-STABLE<br />
                    KERNEL: NEXT.JS 14<br />
                    UPTIME: 99.9%
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-2 opacity-50">
                  <span className="text-[20px]">🪐</span>
                  <span className="text-[9px] text-gray-600 font-mono tracking-widest">XUANJI NAVIGATOR</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// 辅助组件：Section 标题
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-1 h-3 rounded-full bg-[--accent]"></div>
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
    <div className="h-px flex-1 bg-white/5"></div>
  </div>
);
