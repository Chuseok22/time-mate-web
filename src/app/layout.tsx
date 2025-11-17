import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local"

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
})

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

const SITE_URL = "https://meet.chuseok22.com"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "MeetTime",
  description: "약속/모임 시간 정하기. 팀원들과 손쉽게 일정을 정해보세요. 무료로 이용 가능합니다. Schedule your meetings. Easily coordinate times with your teammates — it’s completely free to use.",
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
    <html lang="ko"
          className={`${pretendard.variable} ${pacifico.variable}`}>
      <body className="min-h-screen-safe bg-white text-gray-900 antialiased">

        <div className="min-h-screen-safe pt-safe-top pr-safe-right pb-safe-bottom pl-safe-left">
          <div className="mx-auto w-full max-w-screen-lg">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
