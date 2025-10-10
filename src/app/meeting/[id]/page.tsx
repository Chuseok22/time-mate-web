'use client'
import Header from "@/components/Header";
import BodySection from "@/components/BodySection";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import TimeGrid from "@/features/meeting/components/TimeGrid";
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { TimeGridData } from "@/features/meeting/types/timeGridTypes";

const mockRoomInfoResponse: RoomInfoResponse = {
  meetingRoomId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  title: "팀 회의",
  dates: ["2025-10-08", "2025-10-09", "2025-10-10", "2025-10-11", "2025-10-12", "2025-10-13"],
  participantsCount: 3,
  dateAvailabilityResponses: [
    {
      date: "2025-10-08",
      timeSlotParticipantsResponses: [
        {
          timeSlot: "SLOT_08_00",
          participantInfoResponses: [
            { participantId: "1", username: "김철수" },
            { participantId: "2", username: "이영희" }
          ],
          availabilityCount: 2
        },
        {
          timeSlot: "SLOT_09_00",
          participantInfoResponses: [
            { participantId: "1", username: "김철수" }
          ],
          availabilityCount: 1
        }
      ]
    },
    {
      date: "2025-10-09",
      timeSlotParticipantsResponses: [
        {
          timeSlot: "SLOT_10_00",
          participantInfoResponses: [
            { participantId: "1", username: "김철수" },
            { participantId: "2", username: "이영희" },
            { participantId: "3", username: "박민수" }
          ],
          availabilityCount: 3
        }
      ]
    }
  ]
};

export default function MeetingPage() {
  const [roomInfo, setRoomInfo] = useState<RoomInfoResponse>(mockRoomInfoResponse);

  const transformToTimeGridData = (data: RoomInfoResponse): TimeGridData[] => {
    const gridData: TimeGridData[] = [];

    data.dateAvailabilityResponses.forEach(dateResponse => {
      dateResponse.timeSlotParticipantsResponses.forEach(timeSlotResponse => {
        gridData.push({
          date: dateResponse.date,
          timeSlot: timeSlotResponse.timeSlot,
          usernames: timeSlotResponse.participantInfoResponses.map(participant => participant.username),
          count: timeSlotResponse.availabilityCount
        });
      });
    });

    return gridData;
  }

  const timeGridData = transformToTimeGridData(roomInfo);

  // 가장 인기 있는 시간대 찾기
  const getMostPopularSlot = () => {
    let maxCount = 0;
    let popularSlot = null;

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
  };

  const handleTimeSlotClick = (date: string, timeSlot: string, usernames: string[]) => {
    alert(`클릭된 시간: ${date} ${timeSlot}`);
  }

  return (
      <div className="min-h-screen bg-main">
        <Header title={"모임 제목"} />
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
                    모임 제목 여기다가 쓰셈
                  </div>
                  <div>
                    모임 코드: ID 여따가 적으셈
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-main rounded-2xl gap-3 p-5 w-full">
                <p className="text-xl text-blue-500 font-bold">
                  가장 많은 투표
                </p>
                <p className="text-lg text-blue-500 font-bold">
                  10/1 (월) 10:30 - 2명
                </p>
              </div>
            </div>
          </BodySection>

          <BodySection>
            <div className="flex flex-col w-full gap-4">
              <h2 className="text-xl font-semibold">날짜 선택</h2>
              <p className="font-semibold">참여자들의 시간을 확인하세요</p>
            </div>

            <div>
              <TimeGrid
                  dates={roomInfo.dates}
                  timeGridData={timeGridData}
                  maxParticipantCount={roomInfo.participantsCount}
                  onTimeSlotClick={handleTimeSlotClick}
                  mode='view'
              />
            </div>
          </BodySection>
        </main>
      </div>
  );
};