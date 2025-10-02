'use client'

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
}

export default function Header({
  title,
  onBackClick
}: HeaderProps) {
  const router = useRouter();
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-1">
        <div className="flex items-center justify-between px-4 py-4 h-14">
          <button
              aria-label="뒤로 가기"
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 px-4">
            {title}
          </h1>
          <div className="w-10 h-10" />
        </div>
      </header>
  )
};