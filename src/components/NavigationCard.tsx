import React from 'react';
import { NavigationItem } from '@/types/nav';
import { HighlightText } from './HighlightText';
import Image from 'next/image';
import { useState } from 'react';
import { Tooltip } from './Tooltip';

interface NavigationCardProps {
  item: NavigationItem;
  index: number;
  searchQuery?: string;
  onDelete?: (id: string) => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ item, index, searchQuery, onDelete }) => {
  const isLocal = item.id.startsWith('local-');
  const [imgError, setImgError] = useState(false);

  return (
    <Tooltip content={item.description || '探索这个奇妙的网站...'} className="w-full">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="glow-card group relative flex gap-5 p-6 rounded-2xl bg-gradient-to-br from-[#1e293b]/50 via-[#1e293b]/40 to-[#0f172a]/80 backdrop-blur-md border border-white/5 hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden"
        style={{ animationDelay: `${index * 50} ms` }}
      >
        {/* 动态星轨边框 (仅悬浮时可见) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-2px] bg-gradient-to-r from-[--accent] via-[--secondary] to-[--accent] rounded-2xl animate-[shimmer_3s_linear_infinite] p-[1.5px]">
            <div className="w-full h-full bg-[#0f172a] rounded-[14px]"></div>
          </div>
        </div>

        {/* Delete Button for Local Items */}
        {isLocal && onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm('确定要删除这个星标吗？')) {
                onDelete(item.id);
              }
            }}
            className="absolute top-2 right-2 z-50 p-1.5 rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-300 pointer-events-auto"
            title="删除本地星标"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* 悬浮时的渐变背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[--accent]/0 via-[--accent]/0 to-[--secondary]/0 group-hover:from-[--accent]/5 group-hover:via-transparent group-hover:to-[--secondary]/10 transition-all duration-700 pointer-events-none"></div>

        {/* 左侧图标 */}
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-black/40 to-black/20 text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10 group-hover:border-[--accent]/40 shadow-xl relative overflow-hidden">
          {/* 图标光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-[--accent]/0 group-hover:from-[--accent]/20 to-transparent transition-all duration-500"></div>
          {(item.icon?.startsWith('http') || item.icon?.startsWith('/')) && !imgError ? (
            <Image
              src={item.icon}
              alt={item.title}
              width={36}
              height={36}
              className="w-9 h-9 object-contain relative z-10"
              onError={() => setImgError(true)}
              unoptimized={item.icon.startsWith('data:')} // Handle data URIs if any
            />
          ) : (
            <span className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{!imgError && item.icon && !item.icon.startsWith('http') && !item.icon.startsWith('/') ? item.icon : '🔗'}</span>
          )}
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center relative z-20">
          <div className="flex items-center gap-2 mb-1.5">
            {/* 装饰性星标 */}
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-500 text-[--accent] scale-0 group-hover:scale-100 shadow-[0_0_8px_var(--accent)]">✧</span>
            <h3 className="font-bold text-gray-100 group-hover:text-white truncate transition-all duration-300 text-base tracking-wide group-hover:text-shadow-glow">
              <HighlightText text={item.title} highlight={searchQuery || ''} />
            </h3>
            {/* 外链箭头 */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-1">
              <span className="text-[--accent] text-sm animate-pulse">↗</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-gray-200">
            <HighlightText
              text={item.description || '探索这个奇妙的网站...'}
              highlight={searchQuery || ''}
              highlightClassName="text-[--accent] font-bold underline decoration-[--accent]/40 underline-offset-2"
            />
          </p>
        </div>

        {/* 悬浮时的底部高光 */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[--accent] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      </a>
    </Tooltip>
  );
};
