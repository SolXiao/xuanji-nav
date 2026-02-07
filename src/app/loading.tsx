export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0b0e14] overflow-hidden">
      {/* 背景星空效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
      </div>

      {/* 扫描核心动画 */}
      <div className="relative">
        {/* 外环 */}
        <div className="w-32 h-32 border-2 border-[--accent]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        {/* 内环 */}
        <div className="absolute inset-2 border-2 border-t-[--accent] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

        {/* 中心点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-[--accent] rounded-full shadow-[0_0_20px_var(--accent)] animate-pulse"></div>
        </div>
      </div>

      {/* 文字说明 */}
      <div className="mt-8 flex flex-col items-center space-y-2">
        <h2 className="text-[--accent] font-mono text-sm tracking-[0.3em] uppercase">
          XuanJi Scanning
        </h2>
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-[--accent] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-[--accent] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-[--accent] rounded-full animate-bounce"></div>
        </div>
        <p className="text-gray-500 text-[10px] font-light mt-2">
          探测深空星系中 ...
        </p>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
}
