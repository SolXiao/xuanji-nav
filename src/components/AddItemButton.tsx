'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_TAXONOMY } from '@/lib/constants';

interface AddItemButtonProps {
  existingCategories?: string[];
}

export default function AddItemButton({ existingCategories = [] }: AddItemButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    category: 'Uncategorized',
    subCategory: '',
    url: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 计算当前主分类下的建议子分类
  const subCategorySuggestions = useMemo(() => {
    const config = NAV_TAXONOMY[formData.category];
    return config ? Object.keys(config.subs) : [];
  }, [formData.category]);

  // 简单的自动分类逻辑 (增强版：从全局配置推测)
  const suggestCategory = (title: string, desc: string) => {
    const text = (title + ' ' + desc).toLowerCase();

    for (const [mainCat, config] of Object.entries(NAV_TAXONOMY)) {
      if (config.mainKeywords.some(k => text.includes(k))) {
        let subCat = '';
        for (const [sub, subKeywords] of Object.entries(config.subs)) {
          if (subKeywords.some(sk => text.includes(sk))) {
            subCat = sub;
            break;
          }
        }
        return { category: mainCat, subCategory: subCat };
      }
    }

    return { category: 'Uncategorized', subCategory: '' };
  };

  const fetchMetadata = async () => {
    if (!url) return;

    // 初步正则校验
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!urlPattern.test(url)) {
      setError('星系坐标格式不正确 (无效 URL)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '接入失败，请手动修正');
      }

      const suggestion = suggestCategory(data.title || '', data.description || '');

      setFormData({
        title: data.title || '',
        description: data.description || '',
        icon: data.icon || '',
        category: suggestion.category,
        subCategory: suggestion.subCategory,
        url: data.url || url
      });
      setStep('preview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '深空由于未知原因无法探测该站点');
      setFormData({
        title: '',
        description: '',
        icon: '',
        category: 'Uncategorized',
        subCategory: '',
        url: url
      });
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      setError('星系必须有个名字 (Title is required)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('通信中断，存入失败');

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setUrl('');
        setStep('input');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setError(error.message || '未知异常，存入失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('input');
    setUrl('');
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] group">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-accent/90 to-secondary/90 text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] backdrop-blur-md rounded-l-full transition-all duration-500 ease-out translate-x-8 group-hover:translate-x-0 cursor-pointer overflow-hidden border border-white/20 hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.5)]"
          aria-label="Add Navigation Item"
        >
          <span className="text-2xl font-light transform group-hover:rotate-90 transition-transform duration-500">+</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden transition-all duration-500 scale-100 opacity-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[--accent] opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

            {success ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">收录成功！</h2>
                <p className="text-gray-400 text-sm">该星系已接入璇玑航图</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {step === 'input' ? '发现新星系' : '星系档案确认'}
                </h2>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2 animate-in slide-in-from-top-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {step === 'input' ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="输入网址 (e.g. github.com)"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (error) setError(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && url && !loading && fetchMetadata()}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[--accent] transition-all focus:ring-1 focus:ring-[--accent]/30"
                        autoFocus
                      />
                      {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-[--accent] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 px-1 italic">
                      璇玑将探测站点元数据，并进行智能分类。
                    </p>

                    <button
                      onClick={fetchMetadata}
                      disabled={!url || loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[--accent] to-[--accent-light] text-[--primary-dark] font-bold hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      {loading ? '星系扫描中...' : '开始探索'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="flex justify-center mb-4 pt-1">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[--accent] to-[--secondary] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative w-20 h-20 rounded-2xl bg-[#1e293b] border border-white/10 p-3 flex items-center justify-center overflow-hidden">
                          {formData.icon ? (
                            <img src={formData.icon} alt="icon" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-3xl">✨</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1">星系名称 (Title)</label>
                      <input
                        value={formData.title}
                        placeholder="站点名称"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1">主星系 (Category)</label>
                        <div className="relative">
                          <input
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="主分类"
                            list="category-suggestions"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30 outline-none transition-all text-sm"
                          />
                          <datalist id="category-suggestions">
                            {existingCategories.map(cat => (
                              <option key={cat} value={cat} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1">子星系 (SubCategory)</label>
                        <div className="relative">
                          <input
                            value={formData.subCategory}
                            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                            placeholder="二级分类"
                            list="subcategory-suggestions"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30 outline-none transition-all text-sm"
                          />
                          <datalist id="subcategory-suggestions">
                            {subCategorySuggestions.map(sub => (
                              <option key={sub} value={sub} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider ml-1">探测描述 (Description)</label>
                      <textarea
                        value={formData.description}
                        placeholder="简短描述该星系"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30 outline-none h-20 resize-none transition-all text-sm leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 mt-4 mb-2">
                      <button
                        onClick={() => {
                          setStep('input');
                          setError(null);
                        }}
                        className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-medium"
                      >
                        返回
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[--accent] to-[--accent-light] text-[--primary-dark] font-bold hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] disabled:opacity-50 transition-all active:scale-95"
                      >
                        {loading ? '正在接入...' : '存入航图'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={handleClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
