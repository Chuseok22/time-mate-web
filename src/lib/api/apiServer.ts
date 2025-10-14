import { API_BASE_URL } from "@/lib/types";
import { CustomError } from "@/lib/errors/customError";
import { ErrorCode } from "@/lib/errors/errorCodes";
import { handleErrorResponse } from "@/lib/errors/errorResponse";

export class ApiServer {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL || '';
  }

  /**
   * 공통 요청 메서드
   */
  async request<T>(
      endpoint: string,
      options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // 서버 컴포넌트 로깅
    console.log(`[SSR] ${options.method || 'GET'} ${endpoint} → ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        cache: 'no-store', // SSR 기본 캐시 정책
      });

      // 응답 로깅
      console.log(`[SSR] ${endpoint} 응답: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      // 서버 컴포넌트 에러 처리
      console.error(`[SSR] ${endpoint} 요청 중 오류:`, error);

      if (error instanceof CustomError) {
        throw error;
      } else if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
        }
      }
      throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500);
    }
  }

  // 편의 메서드
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 서버 컴포넌트용 싱글톤 인스턴스
export const apiServer = new ApiServer();