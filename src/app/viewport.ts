import { Viewport } from "next";

const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // 상단 바 흰색
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
};

export default viewport