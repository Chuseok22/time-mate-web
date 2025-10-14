import { ErrorCode } from "@/lib/errors/errorCodes";
import { CustomError } from "@/lib/errors/customError";

export interface ApiErrorResponse {
  errorCode: string;
  errorMessage: string;
}

/**
 * 공통 에러 응답 처리 유틸 메서드
 */
export async function handleErrorResponse(response: Response): Promise<never> {
  const errorData: ApiErrorResponse = await response.json();

  const errorCode = errorData.errorCode as ErrorCode;

  if (Object.values(ErrorCode).includes(errorCode)) {
    throw new CustomError(errorCode, response.status, errorData.errorMessage);
  }

// 알 수 없는 에러 코드인 경우
  throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, response.status, errorData.errorMessage);
}