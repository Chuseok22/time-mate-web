'use client'

import { useState } from "react";
import { CalendarDate } from "@/features/create-meeting/types/calendarTypes";
import { isSameDate } from "@/utils/dateUtils";

export function useCalendar(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDates, setSelectedDates] = useState<CalendarDate[]>([]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const newCalendarDate: CalendarDate = { date: newDate };

    setSelectedDates(prev => {
      // 이미 선택된 날짜인지 검증
      const existingIndex = prev.findIndex(item =>
          isSameDate(item.date, newDate)
      );

      if (existingIndex >= 0) {
        // 이미 선택된 날짜이면 제거
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // 새로운 날짜면 추가
        const newList = [...prev, newCalendarDate];
        return newList.sort((a, b) => a.date.getTime() - b.date.getTime());
      }
    });
  };

  const isDateSelected = (day: number): boolean => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedDates.some(item => isSameDate(item.date, targetDate));
  };

  const clearSelectedDates = () => {
    setSelectedDates([]);
  };

  return {
    currentDate,
    selectedDates,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    isDateSelected,
    clearSelectedDates,
    selectedCount: selectedDates.length,
  }
}