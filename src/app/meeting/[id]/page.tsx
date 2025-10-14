import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX } from "react";
import { ORIGIN_URL } from "@/lib/types";
import Header from "@/components/Header";
import BodySection from "@/components/BodySection";
import { CalendarCheck } from "lucide-react";
import TimeGridContainer from "@/features/meeting/containers/TimeGridContainer";
import { TIME_SLOT_MAP } from "@/types/timeSlot";
import { ErrorCode } from "@/lib/errors/errorCodes";
import { CustomError } from "@/lib/errors/customError";

// 가장 인기 있는 시간대 찾기
function getMostPopularSlot(roomInfo: RoomInfoResponse): { date: string, timeSlot: string, count: number } | null {
  let maxCount: number = 0;
  let popularSlot: { date: string, timeSlot: string, count: number } | null = null;

  roomInfo.dateAvailabilityResponses.forEach(dateResponse => {
    dateResponse.timeSlotParticipantsResponses.forEach(timeSlotResponse => {
      if (timeSlotResponse.availabilityCount > maxCount) {
        maxCount = timeSlotResponse.availabilityCount;
        popularSlot = {
          date: dateResponse.date,
          timeSlot: timeSlotResponse.timeSlot,
          count: timeSlotResponse.availabilityCount
        };
      }
    });
  });

  return popularSlot;
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id: roomId } = await params;

  const response = await fetch(`${ORIGIN_URL}/api/rooms/${roomId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new CustomError(ErrorCode.INVALID_REQUEST);
  }

  const roomInfo: RoomInfoResponse = await response.json();

  const mostPopularSlot = getMostPopularSlot(roomInfo);

  return (
      <div className="min-h-screen bg-main">
        <Header title={`${roomInfo.title}`} />
        <main className="main-container">
          <BodySection>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-row w-10/12 items-center justify-center gap-3">
                <div className="flex flex-1 items-center justify-center">
                  <div className="bg-main p-3.5 rounded-2xl">
                    <CalendarCheck />
                  </div>
                </div>
                <div className="flex flex-col flex-5 gap-1">
                  <div className="text-xl font-bold">
                    {roomInfo.title}
                  </div>
                  <div>
                    모임 코드: {roomId}
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-main rounded-2xl gap-3 p-5 w-full">
                <p className="text-lg text-blue-500 font-bold">
                  가장 많은 투표
                </p>
                {mostPopularSlot ? (
                    <p className="text-blue-500 font-bold">
                      {mostPopularSlot.date} {TIME_SLOT_MAP[mostPopularSlot.timeSlot]} - {mostPopularSlot.count}명
                    </p>
                ) : (
                    <p className="text-gray-500">
                      아직 투표가 없습니다.
                    </p>
                )}
              </div>
            </div>
          </BodySection>

          <BodySection>
            <div className="flex flex-col w-full gap-4">
              <h2 className="text-xl font-semibold">날짜 선택</h2>
              <div className="flex flex-row">
                <div className="font-semibold text-lg mb-4">
                  참여자: <span className="text-xl font-bold text-blue-500">{roomInfo.participantsCount}</span> 명
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center border border-sky-300 rounded-2xl p-4">
              <TimeGridContainer roomInfo={roomInfo} />
            </div>
          </BodySection>
        </main>
      </div>
  )
};