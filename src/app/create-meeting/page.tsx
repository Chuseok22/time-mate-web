'use client'
import Header from "@/components/Header";
import Calendar from "@/features/create-meeting/components/Calendar";
import { useCalendar } from "@/features/create-meeting/hooks/useCalendar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { CreateRoomRequest } from "@/features/create-meeting/types/apiTypes";
import { formatDateForLocalDate } from "@/utils/dateUtils";
import BodySection from "@/components/BodySection";
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { apiClient } from "@/lib/api/apiClient";

export default function CreateMeetingPage() {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const {
    currentDate,
    selectedDates,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    isDateSelected,
  } = useCalendar();

  const handleCreateMeeting = async () => {
    if (!title.trim() || selectedDates.length === 0) {
      alert("모임 제목과 날짜를 선택해주세요");
      return;
    }
    try {
      setIsLoading(true);

      // API 호출
      const createRoomRequest: CreateRoomRequest = {
        title: title.trim(),
        dates: selectedDates.map(item => formatDateForLocalDate(item.date)),
      };
      const roomInfoResponse: RoomInfoResponse = await apiClient.post<RoomInfoResponse>('/api/rooms', createRoomRequest);

      router.push(`/meeting/${roomInfoResponse.meetingRoomId}`);

    } catch (error) {
      handleError(error); // 에러 중앙 처리
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="min-h-screen bg-main">
        <Header title="모임 만들기" />
        <main className="main-container">
          <BodySection>
            <div className="flex flex-col w-full gap-4">
              <h2 className="text-xl font-semibold">모임 정보</h2>

              <div className="flex flex-col gap-2">
                <label className="">
                  모임 제목 <span className="text-red-500">*</span>
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="모임 제목을 입력하세요"
                    className="input-primary"
                    disabled={isLoading}
                />
              </div>
            </div>
          </BodySection>

          <BodySection>

            <div className="flex flex-col w-full gap-4">
              <h2 className="text-xl font-semibold">날짜 선택</h2>

              <Calendar currentDate={currentDate}
                        selectedDates={selectedDates}
                        onDateSelect={handleDateSelect}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        isDateSelected={isDateSelected}
              />
            </div>
          </BodySection>

          <button
              onClick={handleCreateMeeting}
              disabled={!title.trim() || selectedDates.length === 0 || isLoading}
              className="flex justify-center items-center
                         bg-blue-500 text-white text-xl
                         font-bold rounded-2xl
                         w-full py-4 shadow-xl
                         hover:cursor-pointer hover:bg-blue-300
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition"
          >
            {isLoading ? '생성중...' : '모임 만들기'}
          </button>
        </main>
      </div>
  )
};