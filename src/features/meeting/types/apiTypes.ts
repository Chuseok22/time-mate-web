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
  joinCode: string;
  dates: string[];
  participantsCount: number;
  participantInfoResponses: ParticipantInfoResponse[];
  dateAvailabilityResponses: DateAvailabilityResponse[];
}

export interface CreateParticipantRequest {
  meetingRoomId: string;
  username: string;
  password?: string;
}

export interface AvailabilityTimeRequest {
  date: string;
  timeSlots: string[];
}

export interface AvailabilityRequest {
  participantId: string;
  availabilityTimeRequests: AvailabilityTimeRequest[];
}