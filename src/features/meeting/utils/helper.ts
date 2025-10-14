import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { parseTimeSlotToMinutes, toLocalDate } from "@/utils/dateUtils";

export interface PopularSlot {
  date: string;
  timeSlot: string;
  count: number;
}

// 가장 인기 있는 시간대 찾기
export function getMostPopularSlots(roomInfo: RoomInfoResponse): PopularSlot[] {
  let maxCount = 0;

  // 1) 전체 중 최댓값 탐색
  for (const dateResp of roomInfo.dateAvailabilityResponses) {
    for (const slotResp of dateResp.timeSlotParticipantsResponses) {
      if (slotResp.availabilityCount > maxCount) {
        maxCount = slotResp.availabilityCount;
      }
    }
  }

  // 2) 최댓값이 0이면 아무도 투표하지 않은 상태
  if (maxCount === 0) return [];

  // 3) 최댓값과 같은 슬롯들을 모두 수집
  const popular: PopularSlot[] = [];
  for (const dateResp of roomInfo.dateAvailabilityResponses) {
    for (const slotResp of dateResp.timeSlotParticipantsResponses) {
      if (slotResp.availabilityCount === maxCount) {
        popular.push({
          date: dateResp.date,
          timeSlot: slotResp.timeSlot,
          count: slotResp.availabilityCount,
        });
      }
    }
  }

  // 4) 표시 일관성을 위해 날짜 오름차순 → 시간 오름차순으로 정렬
  popular.sort((a, b) => {
    const date1 = toLocalDate(a.date).getTime();
    const date2 = toLocalDate(b.date).getTime();
    if (date1 !== date2) return date1 - date2;
    return parseTimeSlotToMinutes(a.timeSlot) - parseTimeSlotToMinutes(b.timeSlot);
  });

  return popular;
}