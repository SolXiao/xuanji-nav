'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 z-50 group flex items-center justify-center w-16 h-16 rounded-3xl bg-[--accent] text-black shadow-[0_20px_50px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_25px_60px_rgba(var(--accent-rgb),0.5)] hover:scale-110 active:scale-90 transition-all duration-500 cursor-pointer overflow-hidden"
      aria-label="添加星标"
    >
      {/* 动态背景斜影 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>

      <div className="relative z-10">
        <Plus className="w-8 h-8 transition-transform duration-500 group-hover:rotate-90" strokeWidth={3} />
      </div>

      {/* 展开的文字提示 (仅在较大屏幕可见) */}
      <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap hidden md:block">
        <div className="px-4 py-2 rounded-xl bg-[#1e293b] border border-white/10 text-white text-xs font-bold tracking-widest shadow-2xl backdrop-blur-xl">
          ✧ 点亮新星标
        </div>
      </div>
    </button>
  );
};
