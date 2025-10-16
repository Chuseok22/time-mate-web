'use client';

import { JSX, useState } from "react";
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

        <BottomSheet
            isOpen={isOpen(SHEET_ID)}
            onClose={() => close(SHEET_ID)}
            initialHeightPct={50}
            maxHeightPct={70}
        >
          <div>
            <JoinParticipantForm
                roomId={roomId}
            />
          </div>
        </BottomSheet>
      </>
  );
};