// 백엔드 에러 코드 정의
export enum ErrorCode {
  // Global
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  INVALID_RESPONSE_FORMAT = 'INVALID_RESPONSE_FORMAT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',

  // MeetingRoom
  MEETING_ROOM_NOT_FOUND = 'MEETING_ROOM_NOT_FOUND',
  BASE_58_JOIN_CODE_PATTERN_MISMATCH = 'BASE_58_JOIN_CODE_PATTERN_MISMATCH',

  // Participant
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}

// 에러 메시지 매핑
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_REQUEST]: '잘못된 요청입니다.',
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '권한이 없습니다.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다.',
  [ErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ErrorCode.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다.',
  [ErrorCode.INVALID_RESPONSE_FORMAT]: '올바른 응답 형태가 아닙니다.',
  [ErrorCode.UNKNOWN_ERROR]: '오류가 발생했습니다. 다시 시도해주세요.',

  [ErrorCode.MEETING_ROOM_NOT_FOUND]: '모임을 찾을 수 없습니다.',
  [ErrorCode.BASE_58_JOIN_CODE_PATTERN_MISMATCH]: '올바른 모임 코드를 입력해주세요',

  [ErrorCode.INVALID_PASSWORD]: '비밀번호가 일치하지 않습니다.',
};