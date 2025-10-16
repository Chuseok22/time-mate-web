'use client';

import { FormEvent, JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizedString } from "@/utils/stringUtils";
import { apiClient } from "@/lib/api/apiClient";
import { CreateParticipantRequest, ParticipantInfoResponse } from "@/features/meeting/types/apiTypes";
import { CustomError } from "@/lib/errors/customError";
import { Info } from "lucide-react";
import clsx from "clsx";
import { ERROR_MESSAGES, ErrorCode } from "@/lib/errors/errorCodes";

interface JoinParticipantFormProps {
  roomId: string;
}

export default function JoinParticipantForm({
  roomId,
}: JoinParticipantFormProps): JSX.Element {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const normalizedPassword = normalizedString(password) || undefined;

    if (!trimmedUsername) {
      setError("이름을 입력하세요");
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateParticipantRequest = {
        meetingRoomId: roomId,
        username: trimmedUsername,
        password: normalizedPassword,
      };
      const response: ParticipantInfoResponse = await apiClient.post(`/api/participant`, request);
      router.push(`/meeting/${roomId}/vote?participantId=${response.participantId}&username=${encodeURIComponent(response.username)}`);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.userMessage);
      } else {
        setError(ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 lg:gap-8 p-8 justify-center"
          aria-busy={isLoading}
          noValidate
      >
        <div className="text-lg lg:text-xl font-bold">시간 투표하기</div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <label htmlFor="username"
                 className="lg:font-semibold"
          >
            이름 <span className="text-red-500">*</span>
          </label>
          <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              className="input-primary"
              disabled={isLoading}
              autoComplete="off"
              required
              minLength={1}
              maxLength={50}
              aria-invalid={!!error && username.trim().length === 0}
          />
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <label className="lg:font-semibold">
            비밀번호 (선택)
          </label>
          <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요 (선택)"
              className="input-primary"
              disabled={isLoading}
              autoComplete="off"
              minLength={1}
              maxLength={50}
              aria-invalid={false}
          />
          <div className="text-sm lg:text-base text-red-500">
            {error}
          </div>
        </div>

        <button
            type="submit"
            disabled={isLoading}
            aria-disabled={isLoading}
            className={clsx(
                "flex justify-center items-center",
                "w-full rounded-2xl p-2 text-white lg:text-xl",
                "shadow-xl transition",
                isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:cursor-pointer hover:bg-blue-300"
            )}
        >
          {isLoading ? "로딩중..." : "참여하기"}
        </button>

        <div className="flex flex-col gap-4 bg-main p-6 rounded-2xl text-blue-600">
          <div className="flex flex-row gap-2 items-center">
            <div aria-hidden><Info /></div>
            <div className="font-bold">투표 방법</div>
          </div>
          <div className="text-sm font-semibold">
            가능한 시간을 클릭하여 투표하세요.<br />
            선택한 시간은 초록색으로 표시됩니다.<br/>
            다른 사용자들이 투표한 결과는 파란색으로 표시됩니다.
          </div>
        </div>
      </form>
  );
};