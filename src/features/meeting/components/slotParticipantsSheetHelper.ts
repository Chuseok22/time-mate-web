import {
  DateAvailabilityResponse,
  RoomInfoResponse,
  TimeSlotParticipantsResponse
} from "@/features/meeting/types/apiTypes";

export function findDateEntry(
    roomInfo: RoomInfoResponse,
    date: string | null,
): DateAvailabilityResponse | undefined {
  if (!date) {
    return undefined;
  }
  return roomInfo.dateAvailabilityResponses.find(d => d.date === date);
}

export function findTimeSlotEntry(
    dateEntry: DateAvailabilityResponse | undefined,
    timeSlot: string | null,
): TimeSlotParticipantsResponse | undefined {
  if (!dateEntry || !timeSlot) {
    return undefined;
  }
  return dateEntry.timeSlotParticipantsResponses.find(t => t.timeSlot === timeSlot);
}