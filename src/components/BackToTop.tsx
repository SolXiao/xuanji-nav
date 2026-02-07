'use client';

import { useState, useEffect } from 'react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-32 right-10 z-[40] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50 pointer-events-none'
        }`}
    >
      <button
        onClick={scrollToTop}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 text-xl shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.4)] hover:border-[--accent]/40 hover:-translate-y-1 transition-all group active:scale-90"
        aria-label="Back to Top"
      >
        <span className="group-hover:animate-bounce">🚀</span>

        {/* Subtle orbit pulse */}
        <div className="absolute inset-0 rounded-full border border-[--accent]/20 animate-ping opacity-20"></div>
      </button>
    </div>
  );
};
