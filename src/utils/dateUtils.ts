// 날짜 비교 (시간 제외)
export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

// LocalDate(시스템 타임존) 기준 YYYY-MM-DD 문자열
export function formatDateForLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// LocalDateTime(시스템 타임존) 기준 YYYY-MM-DDTHH:mm:ss 문자열
// (백엔드에서 LocalDateTime으로 파싱하기 좋은 형태)
export function formatDateForLocalDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
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
