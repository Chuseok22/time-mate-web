// 라우트 핸들러 ctx 타입
import { NextRequest } from "next/server";

export interface ProxyContext {
  readonly params: Promise<{ path: string[] }>
}

// 프록시 실행에 필요한 설정
export interface ProxyConfig {
  readonly backendBaseUrl: string;
  // [ADDED] (선택) 쿠키를 Authorization: Bearer로 승격하고 싶을 때
  readonly promoteCookieToAuth?: {
    readonly cookieName: string;
    readonly overwriteIfExists?: boolean;
  };
  // [ADDED] (선택) 백엔드로 전달하지 않을 요청 헤더(소문자)
  readonly stripRequestHeaders?: ReadonlyArray<string>;
}

// 내부 유틸 함수 시그니처
export type ProxyHandler = (req: NextRequest, ctx: ProxyContext) => Promise<Response>;
