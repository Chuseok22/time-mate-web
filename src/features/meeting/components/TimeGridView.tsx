'use client'
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX, useEffect, useState } from "react";
import { useBottomSheet } from "@/components/BottomSheetProvider";
import { formatDateForDetailDisplay, toLocalDate } from "@/utils/dateUtils";
import { getAvailabilityCount, getDayNameColor, getSelectedColor } from "./timeGridHelper";
import { ALL_TIME_SLOTS } from "@/types/timeSlot";
import { getLabelOnlyOnHour } from "@/utils/timeSlotUtils";
import SlotParticipantsSheet from "@/features/meeting/components/SlotParticipantsSheet";

interface TimeGridViewProps {
  roomInfo: RoomInfoResponse;
}

interface SelectedSlot {
  date: string;
  timeSlot: string;
}

export default function TimeGridView({
  roomInfo
}: TimeGridViewProps): JSX.Element {
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const { open, close, isOpen, activeId } = useBottomSheet();
  const SHEET_ID = "slotParticipants";

  const handleTimeSlotClick = (date: string, timeSlot: string) => {
    setSelected({ date, timeSlot });
    open(SHEET_ID);
  };

  useEffect(() => {
    if (activeId !== SHEET_ID && selected) {
      setSelected(null);
    }
  }, [activeId, selected]);

  const gridCols = `repeat(${roomInfo.dates.length}, 100px)`;

  return (
    <>
      <div className="w-full">
        <div className="overflow-x-auto no-scrollbar">
          <div className="w-max mx-auto">
            {/* 날짜 헤더 */}
            <div className="grid"
                 style={{ gridTemplateColumns: gridCols }}>
              {roomInfo.dates.map((date) => {
                const { month, day, dayName } = formatDateForDetailDisplay(toLocalDate(date));
                return (
                  <div key={date}
                       className="text-center">
                    <div>{month}월 {day}일</div>
                    <div className={getDayNameColor(dayName)}>{dayName}요일</div>
                  </div>
                );
              })}
            </div>

            {/* 타임슬롯 */}
            <div>
              {ALL_TIME_SLOTS.map((slot) => (
                <div key={slot}
                     className="grid items-center"
                     style={{ gridTemplateColumns: gridCols }}>
                  {roomInfo.dates.map((date) => {
                    const count = getAvailabilityCount(roomInfo, date, slot);
                    const colorClass = getSelectedColor(count, roomInfo.participantsCount);

                    return (
                      <button
                        key={`${date}-${slot}`}
                        type="button"
                        onClick={() => handleTimeSlotClick(date, slot)}
                        className={`h-8 rounded-lg m-0.5 text-sm transition hover:cursor-pointer ${colorClass}`}
                        aria-label={`${date} ${slot} 가능 ${count}명`}
                      >
                        {getLabelOnlyOnHour(slot)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SlotParticipantsSheet
        isOpen={!!selected && isOpen(SHEET_ID)}
        onClose={() => {
          close(SHEET_ID);
          setSelected(null);
        }}
        roomInfo={roomInfo}
        date={selected?.date ?? null}
        timeSlot={selected?.timeSlot ?? null}
      />
    </>
  );
}