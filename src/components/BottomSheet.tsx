'use client'

import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateHeight } from "@/components/bottomSheetHelper";
import clsx from "clsx";

type BottomSheetProps = {
  isOpen: boolean; // 열림 여부
  onClose: () => void; // 닫힘 콜백
  initialHeightPct?: number; // 초기 높이 (vh %)
  maxHeightPct?: number; // 최대 높이 (vh %)
  className?: string; // 추가 클래스
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  initialHeightPct = 25,
  maxHeightPct = 70,
  className,
  children
}: BottomSheetProps): JSX.Element | null {

  const handleRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [heightPct, setHeightPct] = useState<number>(calculateHeight(initialHeightPct, 5, maxHeightPct));
  const [dragging, setDragging] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const startHeightPctRef = useRef<number>(heightPct);
  const pointerIdRef = useRef<number | null>(null);

  const minPct = useMemo(() => 5, []); // 드래그 중 내부 보정용 실제 최소치
  const maxPct = useMemo(() => maxHeightPct, [maxHeightPct]);

  useEffect(() => {
    if (isOpen) {
      setHeightPct(calculateHeight(initialHeightPct, minPct, maxPct));
      setDragging(false);
    }
  }, [isOpen, initialHeightPct, minPct, maxPct]);

  const onEsc = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      },
      [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onEsc]);

  const percentDeltaFromPixel = (deltaY: number): number => {
    const winH = typeof window !== 'undefined' ? window.innerHeight : 0;
    if (winH <= 0) {
      return 0;
    }
    return (-deltaY / winH) * 100;
  }

  // 전역 포인터 이동 핸들러: 핸들 밖으로 손가락이 나가도 계속 추적
  const onGlobalPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault(); // [추가] 스크롤/바운스 충돌 방지
    const deltaY = e.clientY - startYRef.current;
    const deltaPct = percentDeltaFromPixel(deltaY);
    const next = calculateHeight(startHeightPctRef.current + deltaPct, minPct, maxPct);
    setHeightPct(next);
  }, [dragging, minPct, maxPct]);


  // 드래그 종료 공통 처리
  const endDrag = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    pointerIdRef.current = null;

    window.removeEventListener('pointermove', onGlobalPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);

    // 닫기 임계치 (12vh 미만이면 닫힘)
    if (heightPct < 12) {
      onClose();
      return;
    }

    // 최소 초기값 아래로 내려가 있으면 초기 높이로 스냅
    if (heightPct < initialHeightPct) {
      setHeightPct(initialHeightPct);
    }
  }, [dragging, onGlobalPointerMove, heightPct, onClose, initialHeightPct]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // 시트 핸들만 드래그 캡처
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // 일부 브라우저에서 실패 가능 -> 전역 리스너가 보완
    }
    pointerIdRef.current = e.pointerId;
    startYRef.current = e.clientY;
    startHeightPctRef.current = heightPct;
    setDragging(true);

    // [추가] 전역 리스너 등록
    window.addEventListener('pointermove', onGlobalPointerMove, { passive: false });
    window.addEventListener('pointerup', endDrag, { passive: false });
    window.addEventListener('pointercancel', endDrag, { passive: false });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.preventDefault();
    const deltaY = e.clientY - startYRef.current;
    const deltaPct = percentDeltaFromPixel(deltaY);
    const next = calculateHeight(startHeightPctRef.current + deltaPct, minPct, maxPct);
    setHeightPct(next);
  }

  const onPointerUp = () => {
    endDrag();
  };

  if (!isOpen) {
    return null;
  }

  return (
      <div className="fixed inset-x-0 bottom-0 z-50 w-full pointer-events-none">
        <div
            ref={sheetRef}
            role="dialog"
            aria-modal="false"
            aria-label="바텀시트"
            className={clsx(
                'pointer-events-auto mx-auto w-full max-w-screen-lg px-4',
                'bs-animate-in',
                // 시트 박스
                'transform-gpu',
                className
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div
              className={clsx(
                  'bg-white dark:bg-neutral-900 rounded-t-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10',
                  'flex flex-col',
                  dragging ? 'transition-none' : 'transition-[height] duration-300 ease-out',
                  dragging ? 'select-none' : '',
              )}
              style={{ height: `${heightPct}vh` }}
          >
            {/* 드래그 핸들 영역 */}
            <div
                ref={handleRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={clsx(
                    'relative flex items-center justify-center',
                    'h-10 shrink-0 cursor-grab touch-none select-none',
                )}
            >
              <div className="h-1.5 w-10 rounded-full bg-neutral-300" />
            </div>

            {/* 콘텐츠 스크롤 영역 */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              {children}
            </div>

            {/* 하단 닫기 버튼 (sticky) */}
            <div
                className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-neutral-900/60 border-t border-neutral-200 dark:border-neutral-800"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
            >
              <div className="px-4 py-3">
                <button
                    type="button"
                    onClick={onClose}
                    className={clsx(
                        'w-full rounded-xl py-3 text-center font-medium',
                        'bg-blue-500 text-white',
                        'hover:opacity-90 active:opacity-80 transition'
                    )}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}