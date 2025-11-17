'use client';

import { JSX } from "react";
import BottomSheet from "@/components/BottomSheet";
import JoinParticipantForm from "@/features/meeting/components/JoinParticipantForm";
import { useBottomSheet } from "@/components/BottomSheetProvider";

interface JoinParticipantSheetProps {
  roomId: string;
}

export default function JoinParticipantSheet({
  roomId,
}: JoinParticipantSheetProps): JSX.Element {

  const { open, close, isOpen } = useBottomSheet();
  const SHEET_ID = "joinParticipant";

  const opened = isOpen(SHEET_ID);

  return (
    <>
      <button
        type="button"
        onClick={() => open(SHEET_ID)}
        className="bg-sky-500 text-white px-4 py-1
                         lg:text-lg
                         rounded-2xl text-sm font-semibold
                         hover:bg-sky-600 hover:cursor-pointer transition"
      >
        투표하기
      </button>

      {opened && (
        <>
          {/* 회색 배경 오버레이 (로그인/참여 시트는 모달 느낌으로) */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => close(SHEET_ID)}
            aria-hidden
          />

          <BottomSheet
            isOpen={opened}
            onClose={() => close(SHEET_ID)}
            initialHeightPct={60}
            maxHeightPct={80}
          >
            <JoinParticipantForm roomId={roomId} />
          </BottomSheet>
        </>
      )}
    </>
  );
};