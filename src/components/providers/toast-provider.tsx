"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      // 自动跟随系统主题，也可以强制指定 "dark" 或 "light"
      theme="system"
    />
  );
}
