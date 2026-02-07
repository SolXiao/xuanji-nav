'use client';

import { useState } from 'react';
import AddItemModal from './AddItemModal';

interface AddItemButtonProps {
  existingCategories?: string[];
}

export default function AddItemButton({ existingCategories = [] }: AddItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed right-6 bottom-10 z-[100] group">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center p-4 bg-[#0f172a] border border-white/20 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] group-hover:border-[--accent]/50 group-hover:scale-110 active:scale-95"
          aria-label="Add Navigation Item"
        >
          {/* 呼吸灯光效 */}
          <div className="absolute inset-0 rounded-full bg-[--accent] opacity-0 blur-lg group-hover:opacity-20 animate-pulse transition-opacity duration-500"></div>

          <div className="flex items-center gap-0 overflow-hidden transition-all duration-500 max-w-0 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100">
            <span className="text-xs font-bold text-white whitespace-nowrap pl-1 pr-3 tracking-widest">ADD NODE</span>
          </div>

          <span className="text-xl font-light text-white transform group-hover:rotate-90 transition-transform duration-500 relative z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
          </span>
        </button>
      </div>

      <AddItemModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        existingCategories={existingCategories}
      />
    </>
  );
}
