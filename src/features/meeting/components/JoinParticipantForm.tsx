'use client';

import { FormEvent, JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizedString } from "@/utils/stringUtils";
import { apiClient } from "@/lib/api/apiClient";
import { CreateParticipantRequest } from "@/features/meeting/types/apiTypes";
import { CustomError } from "@/lib/errors/customError";
import { Info } from "lucide-react";

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

    const normalizedUsername = normalizedString(username);
    const normalizedPassword = normalizedString(password) || undefined;

    if (!normalizedUsername) {
      setError("이름을 입력하세요");
      return;
    }

    setIsLoading(true);

    try {
      const request: CreateParticipantRequest = {
        meetingRoomId: roomId,
        username: normalizedUsername,
        password: normalizedPassword,
      };
      await apiClient.post(`/api/participant`, request);
      router.push(`/meeting/${roomId}/vote`);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.userMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 lg:gap-8 p-8 justify-center"
      >
        <div className="text-lg lg:text-xl font-bold">시간 투표하기</div>
        <div className="flex flex-col gap-2 lg:gap-4">
          <label className="lg:font-semibold">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              className="input-primary"
              disabled={isLoading}
              autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <label className="lg:font-semibold">
            비밀번호 (선택)
          </label>
          <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요 (선택)"
              className="input-primary"
              disabled={isLoading}
              autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-4 bg-main p-6 rounded-2xl text-blue-600">
          <div className="flex flex-row gap-2 items-center">
            <div className=""><Info /></div>
            <div className="font-bold">투표 방법</div>
          </div>
          <div className="text-sm font-semibold">
            다음 화면에서 가능한 시간대를 클릭하여 선택하세요.<br />
            선택한 시간은 파란색으로 표시됩니다.
          </div>
        </div>
      </form>
  );
};