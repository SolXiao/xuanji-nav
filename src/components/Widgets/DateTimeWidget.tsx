'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Clock, Calendar, Zap } from 'lucide-react';

export const DateTimeWidget: React.FC = () => {
  const { settings } = useSettings();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!settings.features.clockWidget || !mounted) return null;

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 6) return '🌙 夜深了';
    if (hour < 9) return '🌅 晨星初现';
    if (hour < 12) return '☀️ 旭日东升';
    if (hour < 14) return '🌞 日中天';
    if (hour < 18) return '☀️ 午后星光';
    if (hour < 22) return '🌆 暮色星辰';
    return '🌙 繁星满天';
  };

  const formatClock = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return (
      <div className="flex items-center gap-1.5 font-mono text-4xl font-black tracking-tighter text-white">
        <span>{hours}</span>
        <span className="animate-pulse opacity-50">:</span>
        <span>{minutes}</span>
        <span className="text-xl ml-1 text-[--accent] opacity-80">{seconds}</span>
      </div>
    );
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return time.toLocaleDateString('zh-CN', options);
  };

  // 计算年度进度
  const startOfYear = new Date(time.getFullYear(), 0, 1);
  const endOfYear = new Date(time.getFullYear() + 1, 0, 1);
  const progress = ((time.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime()) * 100).toFixed(2);

  return (
    <div className="group relative p-8 rounded-[2rem] bg-[#0f172a]/40 border border-white/5 backdrop-blur-3xl overflow-hidden hover:border-[--accent]/30 transition-all duration-700">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[--accent]/5 blur-[60px] rounded-full group-hover:bg-[--accent]/10 transition-colors"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* 头部：问候与状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[--accent]/10 text-[--accent] text-[10px] font-bold tracking-widest uppercase">
              {getGreeting()}
            </span>
          </div>
          <Zap className="w-4 h-4 text-gray-700 group-hover:text-[--accent] transition-colors duration-500" />
        </div>

        {/* 主体：时钟 */}
        <div className="py-2">
          {formatClock()}
        </div>

        {/* 底部：日期与进度 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{formatDate()}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
              <span className="text-gray-500">2026 年进度</span>
              <span className="text-[--accent]">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[--accent] to-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.3)] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
