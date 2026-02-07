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
    <div className="group relative p-5 md:p-6 rounded-[2rem] bg-[#0f172a]/40 border border-white/5 backdrop-blur-3xl overflow-hidden hover:border-[--accent]/30 transition-all duration-700">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[--accent]/5 blur-[80px] rounded-full group-hover:bg-[--accent]/10 transition-colors pointer-events-none"></div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* 左侧：时间信息 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between md:justify-start md:gap-4">
            <span className="px-3 py-1 rounded-full bg-[--accent]/10 text-[--accent] text-[10px] font-bold tracking-widest uppercase">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <Calendar className="w-4 h-4" />
              <span>{formatDate()}</span>
            </div>
          </div>

          <div className="py-2">
            {formatClock()}
          </div>
        </div>

        {/* 右侧：年度进度 */}
        <div className="space-y-4 md:border-l md:border-white/5 md:pl-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[--accent]" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">2026 年度充能</span>
            </div>
            <span className="text-xl font-mono font-bold text-[--accent]">{progress}%</span>
          </div>

          <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
            <div
              className="h-full bg-gradient-to-r from-[--accent] to-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.4)] relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 text-right font-mono mt-2">
            TIME IS A FLAT CIRCLE
          </p>
        </div>
      </div>
    </div>
  );
};
