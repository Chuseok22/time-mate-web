import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";

export function getSelectedColor(count: number, maxCount: number): string {
  if (count === 0) return 'bg-gray-200 hover:bg-gray-300 text-gray-400 hover:text-gray-500';

  if (count === maxCount) return 'bg-blue-700 hover:bg-blue-800 text-white';
  if (count === maxCount - 1) return 'bg-blue-500 hover:bg-blue-600 text-neutral-100';
  if (count === maxCount - 2) return 'bg-blue-300 hover:bg-blue-400 text-gray-600 hover:text-gray-700';
  return 'bg-blue-100 hover:bg-blue-200 text-gray-400 hover:text-gray-500';
}

export function getAvailabilityCount(roomInfo: RoomInfoResponse, date: string, timeSlot: string): number {
  const day = roomInfo.dateAvailabilityResponses.find((d) => d.date === date);
  if (!day) return 0;
  const slot = day.timeSlotParticipantsResponses.find((t) => t.timeSlot === timeSlot);
  return slot?.availabilityCount ?? 0;
}

export function getDayNameColor(dayName: string): string {
  if (dayName === "토") {
    return "text-blue-500";
  } else if (dayName === "일") {
    return "text-red-500";
  } else {
    return "text-black";
  }
}
