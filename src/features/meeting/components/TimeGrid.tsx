import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX } from "react";
import { formatDateForDetailDisplay, toLocalDate } from "@/utils/dateUtils";
import { ALL_TIME_SLOTS } from "@/types/timeSlot";
import { getAvailabilityCount, getDayNameColor, getSelectedColor } from "@/features/meeting/components/timeGridHelper";
import { getLabelOnlyOnHour } from "@/utils/timeSlotUtils";

interface TimeGridProps {
  roomInfo: RoomInfoResponse;
  onTimeSlotClick?: (date: string, timeSlot: string) => void;
}

export default function TimeGrid({
  roomInfo,
  onTimeSlotClick,
}: TimeGridProps): JSX.Element {
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
                      <div>
                        {month}월 {day}일
                      </div>
                      <div className={getDayNameColor(dayName)}>
                        {dayName}요일
                      </div>
                    </div>
                );
              })}
            </div>

            {/* 선택 slot */}
            <div>
              {ALL_TIME_SLOTS.map((slot) => (
                  <div
                      key={slot}
                      className="grid items-center"
                      style={{ gridTemplateColumns: gridCols }}
                  >
                    {roomInfo.dates.map((date) => {
                      const count = getAvailabilityCount(roomInfo, date, slot);
                      const colorClass = getSelectedColor(count, roomInfo.participantsCount);

                      return (
                          <button
                              key={`${date}-${slot}`}
                              type="button"
                              onClick={() => onTimeSlotClick?.(date, slot)}
                              className={`h-8 rounded-lg m-0.5 
                                    hover:cursor-pointer
                                    text-sm transition
                                    ${colorClass}`
                              }
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
      </div>
  )
}