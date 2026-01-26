'use client';

import { useState, useEffect } from 'react';

interface NetworkData {
  ip: string;
  network: string; // CIDR or Organization
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('API Error');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch network info', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !data) {
      fetchData();
    }
  }, [expanded, data]);

  const handleCopy = () => {
    if (data?.ip) {
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`group flex items-center justify-center p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg hover:scale-105 active:scale-95
          ${expanded
            ? 'bg-[--accent] border-[--accent] text-[--primary-dark]'
            : 'bg-[#0f172a]/80 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        title="网络检测"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className="absolute bottom-16 left-0 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="text-xl">🌐</span> 网络检测
            </h3>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-3">
                <div className="w-6 h-6 border-2 border-[--accent] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">正在分析星际坐标...</span>
              </div>
            ) : data ? (
              <>
                {/* IP Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">📋 IPv4 公网IP</span>
                    <a href="https://www.google.com/search?q=how+to+hide+my+ip" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[--accent] transition-colors cursor-pointer">
                      <span>🕵️ 如何隐藏真实IP❓</span>
                    </a>
                  </div>
                  <div className="group relative bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between hover:border-[--accent]/30 transition-colors">
                    <span className="font-mono text-xl text-[--accent] font-bold tracking-wider">{data.ip}</span>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                      title="复制IP"
                    >
                      {copied ? (
                        <span className="text-green-400 text-xs font-bold">已复制</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <a href="https://scamalytics.com/ip" target="_blank" rel="noreferrer" className="text-[10px] text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                      🛡️ 检查IP风险值 <span className="text-xs">→</span>
                    </a>
                  </div>
                </div>

                {/* ISP Section */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex items-center gap-1">🔌 网络服务商</div>
                  <div className="text-sm text-white font-medium pl-1">{data.org}</div>
                </div>

                {/* Location Section */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex items-center gap-1">📍 位置 (IP归属地)</div>
                  <div className="text-sm text-white font-medium pl-1">
                    {data.country_name} · {data.region} · {data.city}
                  </div>
                  <div className="pt-1">
                    <a href="https://www.ipdatacloud.com/" target="_blank" rel="noreferrer" className="inline-block text-[10px] text-[--accent] opacity-60 hover:opacity-100 transition-opacity bg-[--accent]/10 px-2 py-0.5 rounded-full">
                      高精归属地定位（IP数据云）
                    </a>
                  </div>
                </div>

                {/* Coordinate Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">🌍 经度</div>
                    <div className="font-mono text-xs text-gray-200">{data.longitude}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                    <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">🧭 纬度</div>
                    <div className="font-mono text-xs text-gray-200">{data.latitude}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-400 text-xs py-4">
                无法探测到信号，请检查网络设置。
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
