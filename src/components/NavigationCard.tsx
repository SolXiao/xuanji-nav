import React from 'react';
import { NavigationItem } from '@/types/nav';

interface NavigationCardProps {
  item: NavigationItem;
  index: number;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ item, index }) => {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glow-card group relative flex gap-4 p-5 rounded-2xl bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 hover:bg-[#1e293b]/60 hover:border-[--accent]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[--accent]/5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 text-2xl group-hover:scale-105 group-hover:bg-black/30 transition-all border border-white/5 shadow-inner">
        {item.icon?.startsWith('http') || item.icon?.startsWith('/') ? (
          <img src={item.icon} alt={item.title} className="w-8 h-8 object-contain" />
        ) : (
          item.icon || '🔗'
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-200 group-hover:text-[--accent-light] truncate transition-colors">
            {item.title}
          </h3>
          <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
            <span className="text-[--accent] text-xs">↗</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {item.description || '探索这个奇妙的网站...'}
        </p>
      </div>
    </a>
  );
};
