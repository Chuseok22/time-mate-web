'use client';

import React from "react";
import Image from "next/image";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({
  open,
  onClose
}: HelpModalProps) {
  if (!open) {
    return null;
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      id="help-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50
                     flex items-center justify-center
                     bg-gray-500/50 backdrop-blur-sm"
    >
      <div
        onClick={stop}
        className="flex flex-col items-center justify-center-safe
                       w-4/5 lg:w-2/3 h-4/5 gap-4 max-w-screen-md bg-white py-10 lg:py-0
                       shadow-2xl rounded-2xl overflow-y-auto scroll overscroll-y-none">

        {/* 헤더 */}
        <h2 className="text-lg lg:text-2xl font-bold text-center">
          홈 화면 설치 (Android / iOS)
        </h2>

        {/* 구분선 */}
        <div className="bg-gray-700 w-2/3 h-0.5"></div>

        <div className="flex flex-col items-center justify-center gap-2 text-sm lg:text-base font-semibold">
          <p>
            홈 화면에 추가하여 앱처럼 사용하세요!
          </p>
          <p>
            PlayStore에 <b>&#34;MeetTime&#34;</b> 을 검색해보세요!
          </p>
        </div>

        {/* 이미지 */}
        <div className="grid grid-cols-1 max-w-3/4 gap-8 lg:gap-12 min-[380px]:grid-cols-2">

          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
              <Image
                src="/help/safari.png"
                alt="Safari 화면"
                fill
                className="object-contain"
              />
            </div>

            <div className="font-semibold text-center text-sm lg:text-base">
              1. 공유 버튼 클릭
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
              <Image
                src="/help/share.png"
                alt="홈 화면에 추가 버튼 클릭"
                fill
                className="object-contain"
              />
            </div>
            <div className="font-semibold text-center text-sm lg:text-base">
              2. &#39;홈 화면에 추가&#39;
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
              <Image
                src="/help/add-home.png"
                alt="홈 화면에 추가"
                fill
                className="object-contain"
              />
            </div>
            <div className="font-semibold text-center text-sm lg:text-base">
              3. 어플명 확인
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4]">
              <Image
                src="/help/home-icon.png"
                alt="어플리케이션 추가 완료"
                fill
                className="object-contain"
              />
            </div>
            <div className="font-semibold text-center text-sm lg:text-base">
              4. 앱 추가 완료
            </div>
          </div>

        </div>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-3/5
                        bg-blue-500 rounded-2xl p-2 font-semibold
                        text-white hover:cursor-pointer hover:bg-blue-600/90
                        mt-4 transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}