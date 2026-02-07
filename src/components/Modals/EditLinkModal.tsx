'use client';

import React, { useState, KeyboardEvent } from 'react';
import { NavigationItem } from '@/types/nav';
import { toast } from 'sonner';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NavigationItem;
  onSuccess: () => void;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: item.title || '',
    url: item.url || '',
    description: item.description || '',
    category: item.category || '',
    icon: item.icon || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notion/update-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          ...formData
        })
      });

      if (!response.ok) throw new Error('更新失败');

      toast.success('网站信息已更新');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onKeyDown={handleEscape}>
        <div
          className="relative w-full max-w-2xl bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[--accent]/10 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 px-8 py-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-[--accent]">✏️</span>
                  编辑网站信息
                </h2>
                <p className="text-sm text-gray-400 mt-1">修改后将同步到 Notion 数据库</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 px-8 py-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">网站标题 *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all"
                placeholder="示例：GitHub"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">网站链接 *</label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all"
                placeholder="https://example.com"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all resize-none"
                placeholder="简要描述这个网站..."
              />
            </div>

            {/* Category & Icon */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">分类</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all"
                  placeholder="开发工具"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">图标</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[--accent]/50 focus:ring-2 focus:ring-[--accent]/20 transition-all"
                  placeholder="🌟 或 URL"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-all active:scale-95"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-[--accent] hover:bg-[--accent-light] text-white font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[--accent]/30"
              >
                {isSubmitting ? '更新中...' : '保存更改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
