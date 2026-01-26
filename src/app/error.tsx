'use client';

import { useEffect } from 'react';
import CosmicLoader from '@/components/CosmicLoader';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里将错误记录到监控服务
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[--bg-starry] p-8 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>
        <div className="relative">
          <CosmicLoader />
          {/* 覆盖 CosmicLoader 的文字部分，显示错误信息 */}
          <div className="absolute inset-x-0 -bottom-20 flex flex-col items-center gap-4">
             <h2 className="text-3xl font-bold text-white tracking-widest uppercase">
              航路受阻
            </h2>
            <p className="text-red-400/80 max-w-md font-light text-sm">
              {error.message || '深空探测器遭遇未知干扰，无法建立与 Notion 数据库的链路。'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-24">
        <button
          onClick={() => reset()}
          className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all font-medium backdrop-blur-md active:scale-95"
        >
          重新尝试对接
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[--accent] to-[--secondary] text-[--primary-dark] font-bold shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)] transition-all active:scale-95"
        >
          返回母港
        </button>
      </div>

      <p className="mt-12 text-[10px] text-gray-500 font-mono opacity-50">
        ERROR_DIGEST: {error.digest || 'UNKNOWN_ANOMALY'}
      </p>
    </div>
  );
}
