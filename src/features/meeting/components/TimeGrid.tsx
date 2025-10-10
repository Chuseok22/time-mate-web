import { formatDateForDetailDisplay } from "@/utils/dateUtils";
import { ALL_TIME_SLOTS } from "@/types/timeSlot";
import { formatTimeSlot } from "@/utils/timeSlotUtils";
import { TimeGridProps } from "@/features/meeting/types/timeGridTypes";

export default function TimeGrid({
  dates,
  timeGridData,
  maxParticipantCount,
  onTimeSlotClick,
  selectedSlots = [],
  onSlotToggle,
  mode = 'view'
}: TimeGridProps) {
  const getTimeSlotData = (date: string, timeSlot: string) => {
    return timeGridData.find(data => data.date === date && data.timeSlot === timeSlot);
  }

  const getIntensityColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-gray-100 hover:bg-gray-200';

    const intensity = Math.min(count / maxCount, 1);
    if (intensity <= 0.25) return 'bg-blue-200';
    if (intensity <= 0.5) return 'bg-blue-300';
    if (intensity <= 0.25) return 'bg-blue-400';
    return 'bg-blue-500';
  }

  const isSlotSelected = (date: string, timeSlot: string) => {
    return selectedSlots.some(slot => slot.date === date && slot.timeSlot === timeSlot);
  }

  const handleTimeSlotClick = (date: string, timeSlot: string) => {
    const slotData = getTimeSlotData(date, timeSlot);

    if (mode === 'vote' && onSlotToggle) {
      onSlotToggle(date, timeSlot);
    } else if (mode === 'view' && onTimeSlotClick) {
      onTimeSlotClick(date, timeSlot, slotData?.usernames || []);
    }
  }

  return (
      <div>
        <div className="grid grid-1"
             style={{ gridTemplateColumns: `80px repeat(${dates.length}, 1fr` }}>
          <div className="text-sm font-medium text-gray-700 text-center py-2">시간</div>
          {dates.map((date) => {
            const { year, month, day, dayName } = formatDateForDetailDisplay(new Date(date));
            return (
                <div key={date}
                     className="text-center py-2">
                  <div>
                    {month}/{day}
                  </div>
                  <div>
                    {dayName}
                  </div>
                </div>
            )
          })}
        </div>

        <div>
          {ALL_TIME_SLOTS.map((timeSlot) => {
            return (
                <div
                    key={timeSlot}
                    className='grid items-center'
                    style={{ gridTemplateColumns: `80px repeat(${dates.length}, 1fr)` }}
                >
                  <div>
                    {formatTimeSlot(timeSlot)}
                  </div>

                  {dates.map((date) => {
                    const slotData = getTimeSlotData(date, timeSlot);
                    const count = slotData?.count || 0;
                    const usernames = slotData?.usernames || [];
                    const isSelected = isSlotSelected(date, timeSlot);

                    let colorClass = getIntensityColor(count, maxParticipantCount);

                    if (mode === 'vote' && isSelected) {
                      colorClass = 'bg-blue-500 text-white';
                    }

                    return (
                        <button
                            key={`${date}-${timeSlot}`}
                            type='button'
                            onClick={() => handleTimeSlotClick(date, timeSlot)}
                            className={`${colorClass}`}
                            title={mode === 'view' ? `${count}명 가능` : '클릭하여 선택/해제'}
                        >
                          {mode === 'view' && count > 0 ? count : ''}
                          {mode === 'vote' && isSelected ? '✓' : ''}
                        </button>
                    );
                  })}
                </div>
            );
          })}
        </div>
      </div>
  )
}