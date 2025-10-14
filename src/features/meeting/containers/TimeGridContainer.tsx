"use client"

import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX } from "react";
import TimeGrid from "@/features/meeting/components/TimeGrid";

interface Props {
  roomInfo: RoomInfoResponse
}

export default function TimeGridContainer({ roomInfo }: Props): JSX.Element {
  const handleTimeSlotClick = (date: string, timeSlot: string, usernames: string[]): void => {
    alert(`클릭된 시간: ${date} ${timeSlot}`);
  };

  return (
      <TimeGrid
          roomInfo={roomInfo}
      />

  );
}