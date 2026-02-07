'use client';

import { useState, useEffect } from 'react';
import { X, Shield, Cookie } from 'lucide-react';

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);

  useEffect(() => {
    // 检查是否已经同意过
    const consent = localStorage.getItem('cookie-consent');

    // 检查是否有本地存储数据
    const hasLocalData = localStorage.getItem('local-items') !== null;
    setHasLocalStorage(hasLocalData);

    // 只有在使用本地存储且未同意时显示横幅
    if (!consent && hasLocalData) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    // 清除本地存储的数据
    localStorage.removeItem('local-items');
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    // 刷新页面以应用更改
    window.location.reload();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* 顶部装饰 */}
        <div className="h-1 bg-gradient-to-r from-[--accent] via-yellow-500 to-[--accent] opacity-60"></div>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            {/* 图标 */}
            <div className="flex-shrink-0 p-3 rounded-2xl bg-[--accent]/10 text-[--accent]">
              <Cookie className="w-6 h-6" />
            </div>

            {/* 内容 */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[--accent]" />
                  本地存储使用提示
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  我们检测到您正在使用本地存储功能来保存个人星标。这些数据仅存储在您的浏览器中，我们无法访问。
                  为了提供更好的体验，我们需要您的同意来继续使用本地存储功能。
                </p>
              </div>

              {/* 隐私声明 */}
              <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-200 leading-relaxed">
                  ✓ 所有数据仅存储在您的设备上 &nbsp;|&nbsp; ✓ 我们无法访问您的任何数据 &nbsp;|&nbsp; ✓ 您可以随时清除数据
                </p>
              </div>

              {/* 按钮组 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[--accent] to-yellow-500 text-black font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  同意并继续
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-medium text-sm rounded-xl hover:bg-white/10 transition-all"
                >
                  拒绝并清除数据
                </button>
              </div>
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
