import { NextRequest } from "next/server";
import { CreateRoomRequest } from "@/features/create-meeting/types/apiTypes";
import { API_BASE_URL } from "@/lib/types";

export async function POST(request: NextRequest): Promise<Response> {
  const body: CreateRoomRequest = await request.json();

  console.log('[BFF] POST /api/rooms 요청:', body);

  const response = await fetch(`${API_BASE_URL}/api/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}