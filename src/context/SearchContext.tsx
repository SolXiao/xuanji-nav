'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchMode } from '@/hooks/useSearchMode';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isShortcutMode: boolean;
  engineId: string | null;
  displayQuery: string;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Use existing hook logic
  const { isShortcutMode, engineId, displayQuery } = useSearchMode(searchQuery);

  // Close search on shortcut mode exit? Maybe not necessary.

  // Global shortcut '/' to open search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isShortcutMode,
        engineId,
        displayQuery,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
