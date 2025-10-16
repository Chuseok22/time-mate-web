"use client"

import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX, useEffect, useState } from "react";
import TimeGrid from "@/features/meeting/components/TimeGrid";
import SlotParticipantsSheet from "@/features/meeting/components/SlotParticipantsSheet";
import { useBottomSheet } from "@/components/BottomSheetProvider";

interface TimeGridContainerProps {
  roomInfo: RoomInfoResponse
}

interface SelectedSlot {
  date: string;
  timeSlot: string;
}

export default function TimeGridContainer({ roomInfo }: TimeGridContainerProps): JSX.Element {

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const { open, close, isOpen, activeId } = useBottomSheet();
  const SHEET_ID = "slotParticipants";

  const handleTimeSlotClick = (date: string, timeSlot: string): void => {
    setSelectedSlot({ date, timeSlot });
    open(SHEET_ID);
  }

  useEffect(() => {
    if (activeId !== SHEET_ID && selectedSlot) {
      setSelectedSlot(null);
    }
  }, [activeId, selectedSlot]);

  return (
      <>
        <TimeGrid
            roomInfo={roomInfo}
            onTimeSlotClick={handleTimeSlotClick}
        />

        <SlotParticipantsSheet
            open={!!selectedSlot && isOpen(SHEET_ID)}
            onClose={() => {
              close(SHEET_ID);
              setSelectedSlot(null);
            }}
            roomInfo={roomInfo}
            date={selectedSlot?.date ?? null}
            timeSlot={selectedSlot?.timeSlot ?? null}
        />
      </>
  );
}