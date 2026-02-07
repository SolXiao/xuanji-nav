'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe, Type, Tag, AlignLeft, Sparkles, Loader2, Link as LinkIcon, Check } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { suggestCategory } from '@/lib/nav-utils';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUrlChange = async (val: string) => {
    setUrl(val);
    if (val.startsWith('http') && val.includes('.')) {
      fetchMetadata(val);
    }
  };

  const fetchMetadata = async (targetUrl: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.icon) setIcon(data.icon);

      // Auto-suggest category
      if (data.title || data.description) {
        const suggestion = suggestCategory(data.title || '', data.description || '');
        if (suggestion.category && suggestion.category !== 'Uncategorized') {
          setCategory(suggestion.category);
        }
      }
    } catch (e) {
      console.error('Metadata fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ url, title, description, category, icon });
      onClose();
      // 重置表单
      setUrl(''); setTitle(''); setDescription(''); setCategory(''); setIcon('');
      // 立即刷新页面
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* 头部 */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[--accent]/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[--accent]/10 text-[--accent]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">添加星标</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5 font-mono">Ignite New Star</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* URL 输入层 */}
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-[--accent] transition-colors">
              <LinkIcon className="w-3.5 h-3.5" /> 目标星系 URL
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[--accent]/50 focus:outline-none transition-all placeholder:text-gray-700"
              />
              {loading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[--accent] animate-spin" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                <Type className="w-3.5 h-3.5" /> 星标名称
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[--accent]/50 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                <Tag className="w-3.5 h-3.5" /> 归属星域
              </label>
              <input
                type="text"
                required
                placeholder="如: 开发、工具"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[--accent]/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
              <AlignLeft className="w-3.5 h-3.5" /> 简介描述
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[--accent]/50 focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-gradient-to-r from-[--accent] to-yellow-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(var(--accent-rgb),0.2)] flex items-center justify-center gap-3"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {submitting ? '保存星图中...' : '点亮星标'}
          </button>
        </form>
      </div>
    </div>
  );
};
