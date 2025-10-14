// 날짜 비교 (시간 제외)
export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
}

// LocalDate 형태
export function formatDateForLocalDate(date: Date): string {
  return date.toISOString().split('T')[0]; // "2025-10-01"
}

// LocalDateTime 형태 변환
export function formatDateForLocalDateTime(date: Date): string {
  return date.toISOString().slice(0, 19); // "2025-10-01T09:00:00"
}

// string -> Date
export function toLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
}

/** [추가] 슬롯 정렬용: "SLOT_08_30" -> 분(min)으로 변환 */
export function parseTimeSlotToMinutes(slot: string): number {
  // 기대 포맷: SLOT_HH_MM
  const m = slot.match(/^SLOT_(\d{2})_(\d{2})$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh * 60 + mm;
}

// 상세 표시용 포맷
export function formatDateForDetailDisplay(date: Date): { year: number, month: number; day: number; dayName: string } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];

  return { year, month, day, dayName };
}
