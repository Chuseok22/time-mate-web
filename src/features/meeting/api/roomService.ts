import { CreateRoomRequest } from "@/features/create-meeting/types/apiTypes";
import { apiClient } from "@/lib/api/apiClient";
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";

export class RoomService {
  // 모임 생성
  async createRoom(request: CreateRoomRequest): Promise<RoomInfoResponse> {
    return apiClient.post<RoomInfoResponse>('/api/rooms', request);
  }

  // 조회
  async getRoom(roodId: string): Promise<RoomInfoResponse> {
    return apiClient.get<RoomInfoResponse>(`/api/rooms/${roodId}`);
  }
}

// 싱글톤 인스턴스
export const roomService = new RoomService();