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

// 상세 표시용 포맷
export function formatDateForDetailDisplay(date: Date): { year: number, month: number; day: number; dayName: string } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];

  return { year, month, day, dayName };
}

// 시간 표시용 포맷
export function formatTimeForDisplay(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

