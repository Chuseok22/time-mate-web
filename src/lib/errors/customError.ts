import { ERROR_MESSAGES, ErrorCode } from "@/lib/errors/errorCodes";

export class CustomError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly userMessage: string;

  constructor(
      code: ErrorCode,
      statusCode: number = 500,
      customMessage?: string
  ) {
    const message = ERROR_MESSAGES[code] || '알 수 없는 오류가 발생했습니다.';
    super(message);

    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.userMessage = message

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }

  // 사용자에게 보여줄 메시지
  getUserMessage(): string {
    return this.userMessage;
  }
}