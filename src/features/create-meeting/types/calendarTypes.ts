export interface CalendarDate {
  date: Date;
}

export interface MeetingFormData {
  title: string;
  username: string;
  password?: string;
  selectedDates: CalendarDate[];
}