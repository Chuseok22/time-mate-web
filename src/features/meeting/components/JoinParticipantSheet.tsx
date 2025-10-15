'use client';

import { JSX, useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import JoinParticipantForm from "@/features/meeting/components/JoinParticipantForm";

interface JoinParticipantSheetProps {
  roomId: string;
}

export default function JoinParticipantSheet({
  roomId,
}: JoinParticipantSheetProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
      <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-sky-500 text-white px-4 py-1
                         lg:text-lg
                         rounded-2xl text-sm font-semibold
                         hover:bg-sky-600 hover:cursor-pointer transition"
        >
          투표하기
        </button>

        <BottomSheet
            isOpen={open}
            onClose={() => setOpen(false)}
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