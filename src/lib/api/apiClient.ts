import { ApiErrorResponse } from "@/lib/errors/apiTypes";
import { ErrorCode } from "@/lib/errors/errorCodes";
import { CustomError } from "@/lib/errors/customError";

export class ApiClient {
  async request<T>(
      endpoint: string,
      options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();

    try {
      const response = await fetch(`${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new CustomError(ErrorCode.TIMEOUT_ERROR, 408);
        } else if (error.message.includes('fetch')) {
          throw new CustomError(ErrorCode.NETWORK_ERROR, 0);
        }
      }
      throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, 500);
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData: ApiErrorResponse = await response.json();

    const errorCode = errorData.errorCode as ErrorCode;

    if (Object.values(ErrorCode).includes(errorCode)) {
      throw new CustomError(errorCode, response.status, errorData.errorMessage);
    }

    // 알 수 없는 에러 코드인 경우
    throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, response.status, errorData.errorMessage);
  }

  // 편의 메서드 (GET, POST, PUT, PATCH, DELETE)
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
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

// 싱글톤 인스턴스
export const apiClient = new ApiClient();