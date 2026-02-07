'use client';

import { useState, useEffect, useRef } from 'react';

interface NetworkData {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export default function NetworkStatus() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startAutoCloseTimer = (delay = 8000) => {
    clearAutoCloseTimer();
    autoCloseTimerRef.current = setTimeout(() => {
      setExpanded(false);
    }, delay);
  };

  const clearAutoCloseTimer = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const fetchData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);

    // 设置请求超时 (10秒)
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API Error');
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Network fetch aborted or timed out');
      } else {
        console.error('Failed to fetch network info', error);
      }
    } finally {
      setLoading(false);
      // 如果是在展开状态下完成获取，重置自动关闭计时器
      if (expanded) startAutoCloseTimer();
    }
  };

  useEffect(() => {
    if (expanded) {
      if (!data) {
        fetchData();
      }
      startAutoCloseTimer();
    } else {
      clearAutoCloseTimer();
    }

    return () => clearAutoCloseTimer();
  }, [expanded, data]);

  const handleCopy = () => {
    if (data?.ip) {
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // 复制操作重置计时器
      startAutoCloseTimer();
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mt-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest">
          网络坐标分析
        </h3>
        {loading && <div className="w-3 h-3 border-2 border-[--accent] border-t-transparent rounded-full animate-spin"></div>}
      </div>

      <div className="p-4 space-y-4">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400 space-y-2">
            <div className="w-5 h-5 border-2 border-[--accent] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] uppercase tracking-tighter">正在探测...</span>
          </div>
        ) : data ? (
          <>
            {/* IP Section */}
            <div className="space-y-1.5">
              <div className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">IPv4 公网星位</div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between hover:border-[--accent]/30 transition-colors">
                <span className="font-mono text-base text-[--accent] font-bold tracking-wider">{data.ip}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                  {copied ? (
                    <span className="text-green-400 text-[9px] font-bold">已同步</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* ISP & Location */}
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px]">服务商</span>
                <span className="text-gray-300 font-medium">{data.org}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[10px]">地理归属</span>
                <span className="text-gray-300 font-medium truncate max-w-[140px]">{data.city}, {data.country_code}</span>
              </div>
            </div>

            <button
              onClick={fetchData}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[9px] text-gray-500 uppercase tracking-widest transition-all active:scale-95"
            >
              重新扫描坐标
            </button>
          </>
        ) : (
          <div className="text-center text-red-500 text-[10px] py-4 bg-red-500/5 rounded-xl border border-red-500/10">
            无法连接至基站，<button onClick={fetchData} className="underline text-red-400">重试</button>
          </div>
        )}
      </div>
    </div>
  );
}
