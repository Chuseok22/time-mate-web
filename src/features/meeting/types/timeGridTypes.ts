export interface TimeGridData {
  date: string;
  timeSlot: string;
  usernames: string[];
  count: number;
}

export interface TimeGridProps {
  dates: string[];
  timeGridData: TimeGridData[];
  maxParticipantCount: number;
  onTimeSlotClick?: (date: string, timeSlot: string, usernames: string[]) => void;
  selectedSlots?: { date: string, timeSlot: string }[];
  onSlotToggle?: (date: string, timeSlot: string) => void;
  mode?: 'view' | 'vote';
}