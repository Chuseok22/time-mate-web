import { CalendarDate } from "@/features/create-meeting/types/calendarTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  currentDate: Date;
  selectedDates: CalendarDate[];
  onDateSelect: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDateSelected: (day: number) => boolean;
}

export default function Calendar({
  currentDate,
  selectedDates,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  isDateSelected,
}: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    // 요일 헤더
    const dayHeaders = dayNames.map((day, index) => (
        <div
            key={day}
            className={`text-center text-sm font-semibold py-3
                        ${index === 0 ? `text-red-500` : index === 6 ? `text-blue-500` : `text-gray-700`}
            `}
        >
          {day}
        </div>
    ));

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}
                     className="py-3" />);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isDateSelected(day);
      days.push(
          <button
              key={day}
              onClick={() => onDateSelect(day)}
              className={`p-3 text-center text-sm font-medium rounded-lg transition-colors ${
                  selected
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
              }`}
          >
            {day}
          </button>
      );
    }

    return (
        <div className="grid grid-cols-7 gap-1">
          {dayHeaders}
          {days}
        </div>
    );
  };

  return (
      <div className="flex flex-col gap-4 items-center">
        {/* 월 네비게이션 */}
        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-1 justify-center items-center">
            <button
                onClick={onPrevMonth}
                className="p-2 hover:bg-gray-100 hover:cursor-pointer rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>


          <h3 className="flex flex-5 justify-center items-center text-lg font-bold text-gray-900">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h3>

          <div className="flex flex-1 justify-center items-center">
            <button
                onClick={onNextMonth}
                className="p-2 hover:bg-gray-100 hover:cursor-pointer rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 달력 */}
        <div className="flex justify-center items-center max-w-md">
          {renderCalendar()}
        </div>
      </div>
  );
};