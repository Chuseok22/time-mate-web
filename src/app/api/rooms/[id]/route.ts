import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/types";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  console.log(`[BFF] GET /api/rooms/${id} 요청`)

  const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('[BFF] 백엔드 API 호출 중 오류 발생');
    const data = await response.json()
    return NextResponse.json(data);
  }

  const data = await response.json();

  return NextResponse.json(data);
}