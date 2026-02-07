import React from 'react';

interface AppShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  header,
  children,
  footer,
  className = ""
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-[--bg-starry] text-[--foreground] ${className}`}>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px]">
        {header}
      </header>

      {/* Main Content Area */}
      {/* pt-[72px] matches header height */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto pt-[72px] px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full h-full py-6 md:py-8 lg:py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      {footer && (
        <footer className="w-full mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
          {footer}
        </footer>
      )}
    </div>
  );
};
