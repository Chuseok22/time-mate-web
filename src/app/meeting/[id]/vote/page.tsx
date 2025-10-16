import TimeGridVote from "@/features/meeting/components/TimeGridVote";
import { JSX } from "react";
import { RoomInfoResponse } from "@/features/meeting/types/apiTypes";
import { apiServer } from "@/lib/api/apiServer";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import BodySection from "@/components/BodySection";
import { CalendarCheck } from "lucide-react";
import CopyButton from "@/features/meeting/components/CopyButton";

type searchParams = Record<string, string>;

export default async function VotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: searchParams;
}): Promise<JSX.Element> {
  const { id: roomId } = await params;

  // 쿼리스트링에서 participantId, username 추출
  const participantId: string = searchParams.participantId;
  const username: string = searchParams.username;

  if (!participantId || !username) {
    redirect(`/meeting/${roomId}`);
  }

  const roomInfo: RoomInfoResponse = await apiServer.get<RoomInfoResponse>(`/api/rooms/${roomId}`);

  return (
      <div className="min-h-screen bg-main">
        <Header title={`${username}`} />

        <main className="main-container">

          <BodySection>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-row w-full items-center justify-center gap-3">
                <div className="flex flex-1 items-center justify-center">
                  <div className="bg-main p-3.5 rounded-2xl">
                    <CalendarCheck />
                  </div>
                </div>
                <div className="flex flex-col flex-5 gap-2">
                  <div className="text-lg font-bold">
                    {roomInfo.title}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="font-semibold">
                      모임 코드: {roomInfo.joinCode}
                    </div>
                    <CopyButton joinCode={roomInfo.joinCode} />
                  </div>
                </div>
              </div>
            </div>
          </BodySection>

          <BodySection>
            <TimeGridVote
                roomInfo={roomInfo}
                participantId={participantId}
            />
          </BodySection>
        </main>
      </div>
  );
};