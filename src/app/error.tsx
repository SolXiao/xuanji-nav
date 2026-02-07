'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里将错误上报给监控服务
    console.error('璇玑导航探测异常:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0b0e14] p-6 text-center">
      {/* 视觉干扰效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[recession_2s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-white animate-pulse"></div>
      </div>

      {/* 错误图标 */}
      <div className="relative mb-8">
        <div className="w-24 h-24 border-2 border-red-500/30 rounded-full animate-pulse flex items-center justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1">
          <span className="flex h-3 w-3 shadow-[0_0_10px_rgba(239,68,68,1)]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      </div>

      {/* 错误文案 */}
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-white tracking-wider">
          探测系统遭遇黑洞
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          星系数据链路由于不可知原因发生坍塌。可能是 Notion 通道暂时性闭合或深海电缆波动。
        </p>
        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <p className="text-[10px] font-mono text-red-400 break-all opacity-70">
            ERROR_CODE: {error.digest || 'UNKNOWN_GRAVITY_ANOMALY'}
          </p>
        </div>
      </div>

      {/* 交互按钮 */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          强制退出
        </button>
        <button
          onClick={() => reset()}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all active:scale-95 text-sm"
        >
          尝试重新连接
        </button>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-8 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
        Signal Lost // Re-establishing Link
      </div>
    </div>
  );
}
