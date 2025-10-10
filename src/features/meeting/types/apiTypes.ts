export interface ParticipantInfoResponse {
  participantId: string;
  username: string;
}

export interface TimeSlotParticipantsResponse {
  timeSlot: string;
  participantInfoResponses: ParticipantInfoResponse[];
  availabilityCount: number;
}

export interface DateAvailabilityResponse {
  date: string;
  timeSlotParticipantsResponses: TimeSlotParticipantsResponse[]
}

export interface RoomInfoResponse {
  meetingRoomId: string;
  title: string;
  dates: string[];
  participantsCount: number;
  dateAvailabilityResponses: DateAvailabilityResponse[];
}