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
      <html lang="ko" className={pacifico.variable}>
      <body className="min-h-screen-safe bg-white text-gray-900 antialiased">

      {/* ===== Color Shims: safe-area 배경을 강제로 'white'로 칠함 ===== */}
      <div
          className="fixed top-0 left-0 right-0 z-[60] bg-white dark:bg-gray-950"
          style={{ height: "env(safe-area-inset-top, 0)" }}
          aria-hidden
      />
      <div
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-gray-950"
          style={{ height: "env(safe-area-inset-bottom, 0)" }}
          aria-hidden
      />
      {/* =========================================================== */}

      <div className="min-h-screen-safe pt-safe-top pr-safe-right pb-safe-bottom pl-safe-left">
        <div className="mx-auto w-full max-w-screen-lg">
          {children}
        </div>
      </div>

      </body>
      </html>
  );
}
