'use client'
import Header from "@/components/Header";
import Calendar from "@/features/create-meeting/components/Calendar";
import { useCalendar } from "@/features/create-meeting/hooks/useCalendar";
import { useState } from "react";

export default function CreateMeetingPage() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const handleCreateMeeting = async () => {
    if (!title.trim() || selectedDates.length === 0) {
      alert("모임 제목과 날짜를 선택해주세요");
      return;
    }
    try {
      setIsLoading(true);
      // 백엔드 api 호출
    } catch (error) {
      console.error('모임 생성 실패', error)
    } finally {
      setIsLoading(false);
    }

  }
  const {
    currentDate,
    selectedDates,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    isDateSelected,
  } = useCalendar();

  return (
      <div className="min-h-screen bg-main">
        <Header title="모임 만들기" />
        <main className="flex flex-col items-center px-4 lg:px-8 py-4 gap-8">
          <div className="flex flex-col bg-white rounded-2xl w-full px-6 py-8 gap-4">
            <h2 className="text-xl font-semibold">모임 정보</h2>

            <div className="flex flex-col gap-2">
              <label className="">
                모임 제목 <span className="text-red-500">*</span>
              </label>
              <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="모임 제목을 입력하세요"
                  className="ring-gray-100 ring-2 outline-none p-3.5 rounded-2xl focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col bg-white rounded-2xl w-full px-6 py-8 gap-4">

            <h2 className="text-xl font-semibold">날짜 선택</h2>

            <Calendar currentDate={currentDate}
                      selectedDates={selectedDates}
                      onDateSelect={handleDateSelect}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      isDateSelected={isDateSelected}
            />
          </div>

          <button
              onClick={handleCreateMeeting}
              className="flex justify-center items-center
                         bg-blue-500 text-white text-xl
                         font-bold rounded-2xl
                         w-full py-4 shadow-xl
                         hover:cursor-pointer hover:bg-blue-300 transition"
          >
            {isLoading ? '생성중...' : '모임 만들기'}
          </button>
        </main>
      </div>
  )
};