"use client"

import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX, useState } from "react";
import TimeGrid from "@/features/meeting/components/TimeGrid";
import SlotParticipantsSheet from "@/features/meeting/components/SlotParticipantsSheet";

interface TimeGridContainerProps {
  roomInfo: RoomInfoResponse
}

interface SelectedSlot {
  date: string;
  timeSlot: string;
}

export default function TimeGridContainer({ roomInfo }: TimeGridContainerProps): JSX.Element {

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const handleTimeSlotClick = (date: string, timeSlot: string): void => {
    setSelectedSlot({ date, timeSlot });
  }

  return (
      <>
        <TimeGrid
            roomInfo={roomInfo}
            onTimeSlotClick={handleTimeSlotClick}
        />

        <SlotParticipantsSheet
            open={!!selectedSlot}
            onClose={() => setSelectedSlot(null)}
            roomInfo={roomInfo}
            date={selectedSlot?.date ?? null}
            timeSlot={selectedSlot?.timeSlot ?? null}
        />
      </>
  );
}