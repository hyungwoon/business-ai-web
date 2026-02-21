import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://business-ai-web-phi.vercel.app'

export const metadata: Metadata = {
  title: "Business AI Team",
  description: "마케팅, 재무, 법무, HR, 개발 등 16개 AI 전문가 팀과 함께하는 비즈니스 어시스턴트",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'Business AI Team',
    description: '마케팅, 재무, 법무, HR, 개발 등 16개 AI 전문가 팀과 함께하는 비즈니스 어시스턴트',
    url: baseUrl,
    siteName: 'Business AI Team',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business AI Team',
    description: '마케팅, 재무, 법무, HR, 개발 등 16개 AI 전문가 팀과 함께하는 비즈니스 어시스턴트',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
