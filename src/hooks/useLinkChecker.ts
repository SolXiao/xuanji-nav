import { useState, useCallback } from 'react';
import { NavigationItem } from '@/types/nav';
import { checkLinks, LinkStatus } from '@/lib/link-checker';

interface LinkCheckProgress {
  current: number;
  total: number;
  valid: number;
  invalid: number;
}

export const useLinkChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState<LinkCheckProgress>({
    current: 0,
    total: 0,
    valid: 0,
    invalid: 0,
  });
  const [results, setResults] = useState<Map<string, LinkStatus>>(new Map());

  const checkAllLinks = useCallback(async (items: NavigationItem[]) => {
    setIsChecking(true);
    setProgress({ current: 0, total: items.length, valid: 0, invalid: 0 });
    setResults(new Map());

    try {
      const urls = items.map(item => item.url);

      const linkResults = await checkLinks(
        urls,
        (current, total, result) => {
          setProgress(prev => ({
            current,
            total,
            valid: prev.valid + (result.isValid ? 1 : 0),
            invalid: prev.invalid + (result.isValid ? 0 : 1),
          }));

          setResults(prev => new Map(prev).set(result.url, result));
        }
      );

      setResults(linkResults);
      return linkResults;
    } catch (error) {
      console.error('链接检测失败:', error);
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsChecking(false);
    setProgress({ current: 0, total: 0, valid: 0, invalid: 0 });
    setResults(new Map());
  }, []);

  return {
    checkAllLinks,
    isChecking,
    progress,
    results,
    reset,
  };
};
