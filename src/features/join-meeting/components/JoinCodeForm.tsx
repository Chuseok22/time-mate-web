'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/apiClient";
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { CustomError } from "@/lib/errors/customError";
import { normalizedString } from "@/utils/stringUtils";

export default function JoinCodeForm() {
  const router = useRouter();

  const [joinCode, setJoinCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const normalized: string = normalizedString(joinCode);
    if (!normalized) {
      return;
    }
    setIsLoading(true);
    try {
      const response: RoomInfoResponse = await apiClient.get(`/api/rooms/join-code/${normalized}`);
      router.replace(`/meeting/${response.meetingRoomId}`);
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        setError(err.userMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 w-full"
      >
        <div className="flex flex-col gap-2">
          <label className="">
            모임 코드 <span className="text-red-500">*</span>
          </label>
          <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="모임 코드를 입력하세요"
              className="ring-gray-100 ring-2 outline-none p-3.5 rounded-2xl focus:ring-blue-500"
              disabled={isLoading}
          />
        </div>

        {error ? <div className="text-red-500">{error}</div> : null}

        <button
            type="submit"
            disabled={!joinCode.trim() || isLoading}
            className="flex justify-center items-center
                         bg-blue-500 text-white text-xl
                         font-bold rounded-2xl
                         w-full py-4 shadow-xl
                         hover:cursor-pointer hover:bg-blue-300
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition"
        >
          {isLoading ? '참여중...' : '참여하기'}
        </button>
      </form>
  );
};