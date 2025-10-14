import { TIME_SLOT_MAP } from "@/types/timeSlot";

/**
 * 정시(:00)일 때만 라벨(예: '오전 9시')을 반환하고,
 * 30분(:30) 슬롯이면 빈 문자열을 반환
 */
export function getLabelOnlyOnHour(slot: keyof typeof TIME_SLOT_MAP): string {
  return slot.endsWith("_00") ? TIME_SLOT_MAP[slot] : "";
}