'use client';
import { AvailabilityRequest, AvailabilityTimeRequest, RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX, useCallback, useState } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { useRouter } from "next/navigation";
import { ERROR_MESSAGES, ErrorCode } from "@/lib/errors/errorCodes";
import { formatDateForDetailDisplay, toLocalDate } from "@/utils/dateUtils";
import { getAvailabilityCount, getDayNameColor } from "@/features/meeting/components/timeGridHelper";
import { ALL_TIME_SLOTS } from "@/types/timeSlot";
import { getLabelOnlyOnHour } from "@/utils/timeSlotUtils";

export type SelectedMap = Map<string, Set<string>>;

interface TimeGridVoteProps {
  roomInfo: RoomInfoResponse;
  participantId: string;
}

export default function TimeGridVote({
  roomInfo,
  participantId,
}: TimeGridVoteProps): JSX.Element {
  const router = useRouter();

  const [selectedMap, setSelectedMap] = useState<SelectedMap>(new Map());
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 선택된 슬롯 개수 계산
  const selectedCount = Array.from(selectedMap.values())
  .reduce((total, slots) =>
      total + slots.size, 0
  );

  // 슬롯 선택/해제 토글
  const handleTimeSlotClick = useCallback((date: string, timeSlot: string): void => {
    setError(null);

    setSelectedMap(prev => {
      const newMap = new Map();

      // 기존 맵의 모든 항목을 새 맵에 복사 (깊은 복사)
      for (const [key, value] of prev) {
        newMap.set(key, new Set(value));
      }

      const dateSlots = newMap.get(date) || new Set<string>();

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
    });
  }, []);

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
  }

  const gridCols = `repeat(${roomInfo.dates.length}, 100px)`;

  return (
      <div className="w-full">
        <div className="overflow-x-auto">
          <div className="w-max mx-auto">
            {/* 날짜 헤더 */}
            <div
                className="grid"
                style={{ gridTemplateColumns: gridCols }}
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
              {ALL_TIME_SLOTS.map((slot) => (
                  <div
                      key={slot}
                      className="grid items-center"
                      style={{ gridTemplateColumns: gridCols }}
                  >
                    {roomInfo.dates.map((date) => {
                      const isSelected = selectedMap.get(date)?.has(slot) ?? false;
                      const colorClass = isSelected
                          ? "bg-green-500 text-white"
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-400 hover:text-gray-500';

                      return (
                          <button
                              key={`${date}-${slot}`}
                              type="button"
                              onClick={() => handleTimeSlotClick(date, slot)}
                              className={`h-8 rounded-lg m-0.5
                                          hover:cursor-pointer
                                          text-sm transition
                                          ${colorClass}
                                        `}
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