'use client';

import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlight,
  className = '',
  highlightClassName = 'bg-[--accent]/20 text-[--accent-light] font-bold rounded px-1 shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)] border-b border-[--accent]/30'
}) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <mark key={i} className={`${highlightClassName} inline-block leading-tight`}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
};
