import { TIME_SLOT_MAP } from "@/types/timeSlot";

export function formatTimeSlot(timeSlot: string): string {
  return TIME_SLOT_MAP[timeSlot] || timeSlot;
}