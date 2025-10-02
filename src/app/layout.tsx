import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MeetTime | 모임 시간 정하기",
  description: "모임 구성원들의 가능 시간을 손쉽게 수집하고, 최적의 모임 시간을 추천하는 서비스",
  applicationName: 'MeetTime',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MeetTime',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-512x512-maskable.png' }
    ],
  },
  // SEO 친화
  alternates: {
    canonical: '/'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ko" className={`${pacifico.variable}`}>
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      <body
          // Tailwind 전역 클래스: 안전한 영역(p-safe)과 가독성을 위한 기본 레이아웃
          className="min-h-screen-safe bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50"
      >
      {/* 안전영역 패딩: iOS 노치/홈인디케이터 대응 */}
      <div className="min-h-screen-safe pt-safe-top pr-safe-right pb-safe-bottom pl-safe-left bg-red-50 mx-auto w-full max-w-screen-lg"> {/*TODO: bg-red-50 -> bg-main 변경 필요*/}
        {children}
      </div>
      </body>
      </html>
  );
}
