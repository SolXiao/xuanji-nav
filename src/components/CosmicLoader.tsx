export default function CosmicLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 relative overflow-hidden">
      {/* Background stardust */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative w-32 h-32">
        {/* Core star with intensified glow */}
        <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8),0_0_60px_rgba(var(--accent-rgb),0.4)] animate-pulse z-10"></div>

        {/* Outer Ring 1 - Accent */}
        <div className="absolute inset-0 w-full h-full rounded-full border border-white/10 animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-[--accent] shadow-[0_0_10px_var(--accent)]"></div>
        </div>

        {/* Outer Ring 2 - Secondary (Reverse) */}
        <div className="absolute inset-4 w-24 h-24 m-auto rounded-full border border-white/5 animate-[spin_6s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-[--secondary] shadow-[0_0_15px_var(--secondary)]"></div>
        </div>

        {/* Inner Pulsing Ring */}
        <div className="absolute inset-8 w-16 h-16 m-auto rounded-full border-2 border-[--accent]/20 animate-ping opacity-30"></div>

        {/* Decorative thin ring */}
        <div className="absolute inset-2 w-28 h-28 m-auto rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[--accent] text-sm font-light tracking-[0.8em] uppercase animate-pulse">
          Initializing Universe
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-[--accent]/40 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
