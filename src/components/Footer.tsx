'use client';

import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 w-full relative z-10 w-full">
      {/* 顶部渐变分割线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[--accent]/30 to-transparent"></div>

      <div className="bg-[#020617]/60 backdrop-blur-xl pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">


          {/* 品牌核心 - 已移除，保持简洁 */}

          {/* 系统状态指标 */}
          <div className="flex items-center gap-4 px-5 py-2 rounded-full bg-black/40 border border-white/5 text-xs font-mono text-gray-400 backdrop-blur-md shadow-lg hover:border-[--accent]/30 transition-colors duration-500 group cursor-help">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="group-hover:text-emerald-400 transition-colors">SYSTEM_ONLINE</span>
            </div>
            <span className="text-white/10">|</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
              <span className="group-hover:text-blue-400 transition-colors">LATENCY: 24MS</span>
            </div>
          </div>


          {/* 底部版权 - 简化格式 */}
          <div className="text-sm text-gray-400 font-light text-center flex flex-wrap items-center justify-center gap-2">
            <span>© {currentYear} 璇玑导航</span>
            <span className="text-white/20">|</span>
            <Link href="/privacy" className="hover:text-[--accent] transition-colors">
              隐私政策
            </Link>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[--accent] transition-colors"
            >
              MIT License
            </a>
            <span className="text-white/20">|</span>
            <span className="text-gray-600 cursor-not-allowed" title="即将上线">
              用户协议
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
