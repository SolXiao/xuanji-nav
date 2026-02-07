interface CosmicLoaderProps {
  message?: string;
  subMessage?: string;
  variant?: 'default' | 'error' | 'success';
}

export default function CosmicLoader({
  message = 'Initializing Universe',
  subMessage,
  variant = 'default'
}: CosmicLoaderProps) {
  const themes = {
    default: {
      accent: 'var(--accent)',
      accentRgb: 'var(--accent-rgb)',
      glow: 'rgba(var(--accent-rgb), 0.4)',
      coreGlow: 'rgba(255, 255, 255, 0.8)'
    },
    error: {
      accent: '#ef4444',
      accentRgb: '239, 68, 68',
      glow: 'rgba(239, 68, 68, 0.4)',
      coreGlow: 'rgba(239, 68, 68, 0.6)'
    },
    success: {
      accent: '#22c55e',
      accentRgb: '34, 197, 94',
      glow: 'rgba(34, 197, 94, 0.4)',
      coreGlow: 'rgba(34, 197, 94, 0.6)'
    }
  };

  const currentTheme = themes[variant];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-10 relative overflow-hidden">
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
        <div 
          className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white animate-pulse z-10 transition-shadow duration-1000"
          style={{ boxShadow: `0 0 30px ${currentTheme.coreGlow}, 0 0 60px ${currentTheme.glow}` }}
        ></div>

        {/* Outer Ring 1 - Theme Color */}
        <div className="absolute inset-0 w-full h-full rounded-full border border-white/10 animate-[spin_4s_linear_infinite]">
          <div 
            className="absolute top-0 left-1/2 -ml-1.5 w-3 h-3 rounded-full transition-colors duration-1000"
            style={{ backgroundColor: currentTheme.accent, boxShadow: `0 0 15px ${currentTheme.accent}` }}
          ></div>
        </div>

        {/* Outer Ring 2 - Contrast (Reverse) */}
        <div className="absolute inset-4 w-24 h-24 m-auto rounded-full border border-white/5 animate-[spin_6s_linear_infinite_reverse]">
          <div 
            className="absolute bottom-0 left-1/2 -ml-2 w-4 h-4 rounded-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          ></div>
        </div>

        {/* Inner Pulsing Ring */}
        <div 
          className="absolute inset-8 w-16 h-16 m-auto rounded-full border-2 animate-ping opacity-30 transition-colors duration-1000"
          style={{ borderColor: currentTheme.accent }}
        ></div>

        {/* Decorative thin ring */}
        <div className="absolute inset-2 w-28 h-28 m-auto rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p 
          className="text-sm font-light tracking-[0.8em] uppercase animate-pulse text-center max-w-xs transition-colors duration-1000"
          style={{ color: currentTheme.accent }}
        >
          {message}
        </p>
        
        {subMessage && (
          <p className="text-[10px] text-white/40 font-mono tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-700">
            {subMessage}
          </p>
        )}

        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-1000"
              style={{ 
                backgroundColor: currentTheme.accent, 
                opacity: 0.4,
                animationDelay: `${i * 150}ms` 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
