'use client'

import { useCallback } from "react";
import { CustomError } from "@/lib/errors/customError";
import { ErrorCode } from "@/lib/errors/errorCodes";

export function useErrorHandler() {
  const handleError = useCallback((error: unknown) => {
    console.error('에러 발생', error);

    if (error instanceof CustomError) {
      switch (error.code) {
        case ErrorCode.MEETING_ROOM_NOT_FOUND:
          alert('모임을 찾을 수 없습니다. 링크를 다시 확인해주세요.');
          break;

        case ErrorCode.NETWORK_ERROR:
          alert('네트워크 연결을 확인해주세요.');
          break;

        default:
          alert(error.getUserMessage());
      }

      return error;
    }

    // 일반 에러 처리
    const message: string = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    alert(message);
    return new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500, message);
  }, []);

  return { handleError };
}