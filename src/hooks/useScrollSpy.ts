import { useState, useEffect } from 'react';

export function useScrollSpy(
  selectors: string,
  options?: IntersectionObserverInit,
  disabled: boolean = false
) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (disabled) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-category');
          if (id) {
            setActiveId(id);
          }
        }
      });
    }, options);

    const elements = document.querySelectorAll(selectors);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [selectors, options, disabled]);

  return activeId;
}
