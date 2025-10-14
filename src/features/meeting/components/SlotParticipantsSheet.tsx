'use client'

import { ParticipantInfoResponse, RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { JSX, useMemo } from "react";
import { formatDateForDetailDisplay } from "@/utils/dateUtils";
import { TIME_SLOT_MAP } from "@/types/timeSlot";
import { findDateEntry, findTimeSlotEntry } from "@/features/meeting/components/slotParticipantsSheetHelper";
import BottomSheet from "@/components/BottomSheet";

interface SlotParticipantsSheetProps {
  open: boolean;
  onClose: () => void;
  roomInfo: RoomInfoResponse;
  date: string | null;
  timeSlot: string | null;
}

export default function SlotParticipantsSheet({
  open,
  onClose,
  roomInfo,
  date,
  timeSlot,
}: SlotParticipantsSheetProps): JSX.Element | null {

  const headerTitle: string = useMemo<string>(() => {
    if (!date || !timeSlot) {
      return '';
    }
    const { month, day, dayName } = formatDateForDetailDisplay(new Date(date));
    const label: string = TIME_SLOT_MAP[timeSlot] ?? timeSlot;
    return `${month}/${day} (${dayName}) - ${label}`;
  }, [date, timeSlot]);

  const participantInfos: ParticipantInfoResponse[] = roomInfo.participantInfoResponses;

  const available: ParticipantInfoResponse[] = useMemo<ParticipantInfoResponse[]>(() => {
    const dateEntry = findDateEntry(roomInfo, date);
    const slotEntry = findTimeSlotEntry(dateEntry, timeSlot);
    return (slotEntry?.participantInfoResponses ?? []).slice();
  }, [roomInfo, date, timeSlot]);

  const unavailable: ParticipantInfoResponse[] = useMemo<ParticipantInfoResponse[]>(() => {
    if (participantInfos.length === 0) return []; // 로스터가 없으면 비교 불가 → 빈 배열
    const availIds = new Set<string>(available.map((p) => p.participantId));
    return participantInfos.filter((p) => !availIds.has(p.participantId));
  }, [participantInfos, available]);

  if (!open) {
    return null;
  }

  return (
      <BottomSheet isOpen={open}
                   onClose={onClose}
                   initialHeightPct={25}
                   maxHeightPct={70}>
        <div className="flex flex-col items-center gap-4">
          <h2 className="lg:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {headerTitle}
          </h2>


          <div className="flex flex-row items-start w-10/12">
            <div className="flex flex-1 flex-col gap-4 justify-center items-center">
              <div className="flex justify-center items-center gap-1 rounded-full border border-emerald-200 px-2.5 py-1 text-emerald-700 bg-emerald-50 lg:text-lg">
                참석 가능 <strong className="ml-1">{available.length}</strong>명
              </div>
              <div className="flex flex-col gap-2">
                {available.length === 0 ? (
                    <p className="rounded-xl p-4 text-neutral-500">
                      이 시간에 가능한 사람이 없어요.
                    </p>
                ) : (
                    available.map((p) => (
                        <div key={p.participantId}
                             className="lg:text-lg font-semibold"
                        >
                          {p.username}
                        </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 justify-center items-center">
              <div className="flex justify-center items-center gap-1 rounded-full border border-rose-200 px-2.5 py-1 text-rose-700 bg-rose-50 lg:text-lg">
                참석 불가 <strong className="ml-1">{unavailable.length}</strong>명
              </div>
              <div className="flex flex-col gap-2">
                {unavailable.length === 0 ? (
                    <p className="rounded-xl p-4 text-neutral-500">
                      전원이 가능한 시간이에요.
                    </p>
                ) : (
                    unavailable.map((p) => (
                        <div key={p.participantId}
                             className="lg:text-lg font-semibold"
                        >
                          {p.username}
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
  )
}