import { NextRequest, NextResponse } from "next/server";
import { CreateRoomRequest } from "@/features/create-meeting/types/apiTypes";
import { API_BASE_URL } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: CreateRoomRequest = await request.json();

  console.log('[BFF] POST /api/rooms 요청:', body);

  const response = await fetch(`${API_BASE_URL}/api/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    console.error('[BFF] 백엔드 API 호출 중 오류 발생');
    return NextResponse.json(response);
  }
  return NextResponse.json(await response.json());
}