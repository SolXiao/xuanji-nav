import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ToastProvider } from "@/components/providers/toast-provider";
import { SearchProvider } from "@/context/SearchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "璇玑导航 | XuanJi Navigator",
    template: "%s | 璇玑导航"
  },
  description: "基于 Notion 的现代化智能导航网站，提供极速、美观的网址管理与导航服务。",
  keywords: ["导航", "Notion", "网址大全", "璇玑", "XuanJi", "Web3", "AI导航"],
  authors: [{ name: "XuanJi Lab" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://nav.xuanji.cloud",
    title: "璇玑导航 | 探索数字宇宙",
    description: "基于 Notion 的现代化智能导航网站，提供极速、美观的网址管理与导航服务。",
    siteName: "璇玑导航",
  },
  twitter: {
    card: "summary_large_image",
    title: "璇玑导航 | XuanJi Navigator",
    description: "基于 Notion 的现代化智能导航网站",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#3b82f6"
          showSpinner={false}
        />
        <SearchProvider>
          <ToastProvider />
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
