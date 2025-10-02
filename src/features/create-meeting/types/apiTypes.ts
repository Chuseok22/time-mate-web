export interface CreateRoomRequest {
  title: string;
  dates: string[];
}

export interface RoomInfoResponse {
  meetingRoomId: string;
  title: string;
  dates: string[];
  participantsCount: number;
}