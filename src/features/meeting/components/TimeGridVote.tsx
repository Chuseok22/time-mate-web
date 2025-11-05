'use client';
import { AvailabilityRequest, AvailabilityTimeRequest, RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import React, { JSX, useCallback, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { useRouter } from "next/navigation";
import { ERROR_MESSAGES, ErrorCode } from "@/lib/errors/errorCodes";
import { formatDateForDetailDisplay, toLocalDate } from "@/utils/dateUtils";
import { getDayNameColor } from "@/features/meeting/components/timeGridHelper";
import { ALL_TIME_SLOTS } from "@/types/timeSlot";
import { getLabelOnlyOnHour } from "@/utils/timeSlotUtils";

export type SelectedMap = Map<string, Set<string>>;

interface TimeGridVoteProps {
  roomInfo: RoomInfoResponse;
  participantId: string;
}

type Coord = {
  row: number;
  col: number;
};

export default function TimeGridVote({
  roomInfo,
  participantId,
}: TimeGridVoteProps): JSX.Element {
  const router = useRouter();

  const [selectedMap, setSelectedMap] = useState<SelectedMap>(new Map());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startRef = useRef<Coord | null>(null);
  const [dragEnd, setDragEnd] = useState<Coord | null>(null);
  const dragEndRef = useRef<Coord | null>(null);
  const didDragRef = useRef<boolean>(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const dates = roomInfo.dates;
  const slots = ALL_TIME_SLOTS;

  // 선택된 슬롯 개수 계산
  const selectedCount: number = useMemo(
    () => Array.from(selectedMap.values())
    .reduce((total, slots) => total + slots.size, 0),
    [selectedMap]
  );

  // 단일 셀 토글
  const toggleOne = useCallback((prev: SelectedMap, date: string, timeSlot: string): SelectedMap => {
    const newMap = new Map<string, Set<string>>();

    // 기존 맵의 모든 항목을 새 맵에 복사 (깊은 복사)
    for (const [key, value] of prev) {
      newMap.set(key, new Set(value));
    }

    const dateSlots = newMap.get(date) ?? new Set<string>();

    if (dateSlots.has(timeSlot)) {
      // 선택 해제
      dateSlots.delete(timeSlot);
      if (dateSlots.size === 0) {
        newMap.delete(date);
      } else {
        newMap.set(date, dateSlots);
      }
    } else {
      // 선택 추가
      dateSlots.add(timeSlot);
      newMap.set(date, dateSlots);
    }

    return newMap;
  }, []);

  // 사각형 영역 토글
  const toggleRect = useCallback((prev: SelectedMap, a: Coord, b: Coord): SelectedMap => {
    const newMap = new Map<string, Set<string>>();

    // 기존 맵의 모든 항목을 새 맵에 복사 (깊은 복사)
    for (const [key, value] of prev) {
      newMap.set(key, new Set(value));
    }

    const r0 = Math.min(a.row, b.row);
    const r1 = Math.max(a.row, b.row);
    const c0 = Math.min(a.col, b.col);
    const c1 = Math.max(a.col, b.col);

    for (let col = c0; col <= c1; col += 1) {
      const date = dates[col];
      const setForDate = newMap.get(date) ?? new Set<string>();
      for (let row = r0; row <= r1; row += 1) {
        const slot = slots[row];
        if (setForDate.has(slot)) setForDate.delete(slot);
        else setForDate.add(slot);
      }
      if (setForDate.size === 0) newMap.delete(date);
      else newMap.set(date, setForDate);
    }
    return newMap;
  }, [dates, slots]);

  // 화면 좌표에 있는 셀 -> dragEnd 갱신
  const updateCellUnderPointer = useCallback(() => {
    const { x, y } = pointerPosRef.current;
    const cell = document.elementsFromPoint(x, y)
    .find((node): node is HTMLElement => node instanceof HTMLElement && node.dataset.cell === '1') ?? null;

    if (!cell) {
      return;
    }
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (!Number.isNaN(row) && !Number.isNaN(col)) {
      const end = { row, col };
      setDragEnd(end);
      dragEndRef.current = end;
    }
  }, []);

  // 오토 스크롤 루프
  const stopAutoScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    const step = () => {
      if (!isDraggingRef.current || !scrollRef.current) {
        stopAutoScroll();
        return;
      }
      const scroll = scrollRef.current;
      const rect = scroll.getBoundingClientRect();
      const { x, y } = pointerPosRef.current;

      const margin = 64;
      const maxPerFrame = 24;

      // 수평 오토스크롤
      let dx = 0;
      if (x < rect.left + margin) {
        const t = (rect.left + margin - x) / margin; // 0..1
        dx = -t * maxPerFrame;
      } else if (x > rect.right - margin) {
        const t = (x - (rect.right - margin)) / margin; // 0..1
        dx = t * maxPerFrame;
      }

      // 수직 오토스크롤
      let dy = 0;
      if (y < rect.top + margin) {
        const t = (rect.top + margin - y) / margin; // 0..1
        dy = -t * maxPerFrame;
      } else if (y > rect.bottom - margin) {
        const t = (y - (rect.bottom - margin)) / margin; // 0..1
        dy = t * maxPerFrame;
      }

      let didScroll = false;

      // 1) 컨테이너 내부 스크롤 시도
      if (dx !== 0) {
        const nextX = Math.max(0, Math.min(scroll.scrollLeft + dx, scroll.scrollWidth - scroll.clientWidth));
        if (nextX !== scroll.scrollLeft) {
          scroll.scrollLeft = nextX;
          didScroll = true;
        }
      }
      if (dy !== 0) {
        const canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (canScrollY) {
          const nextY = Math.max(0, Math.min(scroll.scrollTop + dy, scroll.scrollHeight - scroll.clientHeight));
          if (nextY !== scroll.scrollTop) {
            scroll.scrollTop = nextY;
            didScroll = true;
          }
        }
      }

      // 2) 컨테이너가 세로 스크롤 불가하면 윈도우를 스크롤(페이지 전체가 스크롤되는 레이아웃 대비)
      if (!didScroll && dy !== 0) {
        const before = window.scrollY;
        // 소수점은 버려도 무방(브라우저가 보간)
        window.scrollBy(0, Math.trunc(dy));
        if (window.scrollY !== before) {
          didScroll = true;
        }
      }

      // 스크롤이 실제 발생했다면 현재 포인터 아래의 셀을 다시 평가해 프리뷰/끝점 업데이트
      if (didScroll) {
        updateCellUnderPointer();
      }

      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
  }, [stopAutoScroll, updateCellUnderPointer]);

  // 드래그 시작
  const handlePointerDown = useCallback((row: number, col: number, e: React.PointerEvent) => {
    setError(null);
    setIsDragging(true);
    isDraggingRef.current = true;
    const start = { row, col };
    startRef.current = start;
    setDragEnd({ row, col });
    dragEndRef.current = start;

    // 포인터 위치 추적(윈도우 레벨) → 오토 스크롤에 사용
    const onMoveWin = (ev: PointerEvent) => {
      pointerPosRef.current = { x: ev.clientX, y: ev.clientY };
    };
    const onUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      const s = startRef.current;
      const e2 = dragEndRef.current;
      if (s && e2) {
        setSelectedMap(prev => toggleRect(prev, s, e2));
      }
      didDragRef.current = true;

      startRef.current = null;
      setDragEnd(null);
      dragEndRef.current = null;

      window.removeEventListener('pointerup', onUp, true);
      window.removeEventListener('pointercancel', onUp, true);
      window.removeEventListener('pointermove', onMoveWin, true);
      stopAutoScroll();
    };

    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    window.addEventListener('pointermove', onMoveWin, true);
    window.addEventListener('pointerup', onUp, true);
    window.addEventListener('pointercancel', onUp, true);

    // 오토 스크롤 시작
    startAutoScroll();
  }, [startAutoScroll, stopAutoScroll, toggleRect]);

  // 드래그 중 마우스/손가락 이동 (컨테이너 레벨로 추적)
  const onGridPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    pointerPosRef.current = { x: e.clientX, y: e.clientY };

    // 현재 포인터 아래 셀 찾기
    const cell =
      document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.cell === '1'
      ) ?? null;

    if (!cell) {
      return;
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (!Number.isNaN(row) && !Number.isNaN(col)) {
      const end = { row, col };
      setDragEnd(end);
      dragEndRef.current = end;
    }
  }, [isDragging]);

  // 클릭(드래그 없이) -> 단일 토글
  const onCellClick = useCallback((date: string, slot: string) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    if (isDragging) {
      return;
    }
    setSelectedMap((prev) => toggleOne(prev, date, slot));
  }, [isDragging, toggleOne]);

  // 선택 초기화
  const onResetSelection = () => {
    setSelectedMap((new Map()));
    setError(null);
  }

  const onSubmit = async () => {
    if (selectedCount === 0) {
      setError("최소 하나 이상의 시간을 선택해주세요");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const availabilityTimeRequests: AvailabilityTimeRequest[] =
        Array.from(selectedMap.entries())
        .map(([date, timeSlots]) => ({
            date,
            timeSlots: Array.from(timeSlots),
          })
        );

      const request: AvailabilityRequest = {
        participantId,
        availabilityTimeRequests,
      };

      // API 호출
      await apiClient.post<void>('/api/time', request);

      // 성공 시 콜백 호출
      router.replace(`/meeting/${roomInfo.meetingRoomId}`);
    } catch (error) {
      console.error('가능 시간 제출 실패:', error);
      setError(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
    } finally {
      setSubmitting(false);
    }
  };

  // 프리뷰 영역 여부
  const isInPreview = useCallback((row: number, col: number) => {
    if (!isDragging || !startRef.current || !dragEnd) return false;
    const r0 = Math.min(startRef.current.row, dragEnd.row);
    const r1 = Math.max(startRef.current.row, dragEnd.row);
    const c0 = Math.min(startRef.current.col, dragEnd.col);
    const c1 = Math.max(startRef.current.col, dragEnd.col);
    return row >= r0 && row <= r1 && col >= c0 && col <= c1;
  }, [isDragging, dragEnd]);

  const gridCols = `repeat(${roomInfo.dates.length}, 100px)`;

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch', maxHeight: '70vh' }}
      >
        <div
          className="w-max mx-auto"
          onPointerMove={onGridPointerMove}
          style={{ touchAction: "none" }}
        >

          {/* 날짜 헤더 */}
          <div
            className="grid select-none"
            style={{ gridTemplateColumns: gridCols, touchAction: "pan-x" }}
          >
            {roomInfo.dates.map((date: string) => {
              const { month, day, dayName } = formatDateForDetailDisplay(toLocalDate(date));
              return (
                <div
                  key={date}
                  className="text-center"
                >
                  <div>{month}월 {day}일</div>
                  <div className={getDayNameColor(dayName)}>{dayName}요일</div>
                </div>
              );
            })}
          </div>

          {/* 타임 슬롯 */}
          <div>
            {slots.map((slot, row) => (
              <div
                key={slot}
                className="grid items-center"
                style={{ gridTemplateColumns: gridCols }}
              >
                {dates.map((date, col) => {
                  const isSelected = selectedMap.get(date)?.has(slot) ?? false;
                  const preview = isInPreview(row, col);
                  const baseColor = isSelected
                    ? "bg-blue-500 text-white"
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-400 hover:text-gray-500';

                  const previewRing = preview ? 'ring ring-2 ring-blue-500 ring-offset-1' : '';

                  return (
                    <button
                      key={`${date}-${slot}`}
                      type="button"
                      data-cell="1"
                      data-row={row}
                      data-col={col}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.setPointerCapture?.(e.pointerId);
                        handlePointerDown(row, col, e);
                      }}
                      onClick={() => onCellClick(date, slot)}
                      className={`h-8 rounded-lg m-0.5
                                          hover:cursor-pointer
                                          text-sm transition
                                          ${baseColor}
                                          ${previewRing}
                                        `}
                      aria-pressed={isSelected}
                    >
                      {getLabelOnlyOnHour(slot)}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 하단 제출 바 */}
      <div className="sticky bottom-0 mt-4 flex flex-col items-center gap-3 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 p-3 rounded-xl border">
        {error && (
          <div className="text-sm lg:font-semibold text-red-500">
            {error}
          </div>
        )}
        <div className="flex flex-row items-center justify-between gap-3 w-full">
          <div className="text-sm text-gray-700">
            선택된 슬롯: <span className="font-bold">{selectedCount}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onResetSelection}
              disabled={submitting || selectedCount === 0}
              className="h-10 rounded-xl px-4 text-sm font-semibold border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting || selectedCount === 0}
              className="h-10 rounded-xl px-8 lg:px-12 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}