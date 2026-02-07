'use client';

import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  if (!content) return <>{children}</>;

  return (
    <div className={`group/tooltip relative ${className}`}>
      {children}

      {/* 自定义 Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] scale-95 group-hover/tooltip:scale-100">
        {/* 箭头 */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
          <div className="w-3 h-3 bg-[#1e293b] border-r border-b border-white/10 rotate-45"></div>
        </div>

        {/* Tooltip 内容 */}
        <div className="relative max-w-xs px-4 py-3 rounded-xl bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* 光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[--accent]/10 to-transparent rounded-xl"></div>

          <p className="relative text-xs text-gray-300 leading-relaxed whitespace-normal break-words">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
