import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[--bg-starry] p-8 text-center overflow-hidden">
      {/* 背景动态星空效果 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[--accent] opacity-5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[--secondary] opacity-5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-white/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
              <div className="w-2 h-2 bg-[--accent] rounded-full absolute top-0 shadow-[0_0_10px_var(--accent)]"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase">
            星系丢失
          </h2>
          <p className="text-gray-400 max-w-md font-light">
            您试图访问的坐标不存在于当前的感知范围。该星系可能已被黑洞吞噬或尚未被收录。
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-[--accent] to-[--accent-light] text-[--primary-dark] font-bold shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--accent-rgb),0.5)] transition-all active:scale-95 group"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回母港
          </span>
        </Link>
      </div>

      {/* 装饰性漂浮物 */}
      <div className="absolute top-20 right-[15%] w-1 h-1 bg-white rounded-full animate-twinkle"></div>
      <div className="absolute bottom-40 left-[10%] w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-[5%] w-2 h-2 bg-[--secondary]/20 rounded-full animate-pulse"></div>
    </div>
  );
}
