import Image from "next/image";
import { CalendarPlus, Users } from "lucide-react";
import ActionCard from "@/features/home/components/ActionCard";
import HelpButton from "@/features/home/components/HelpButton";

export default function Home() {
  return (
      <div className="flex flex-col min-h-screen items-center bg-main gap-3 w-full py-20">
        <div className="flex justify-center items-center text-5xl font-pacifico">
          meetTime
        </div>
        <div className="flex justify-center items-center text-lg">
          모임 시간을 쉽게 정해보세요
        </div>
        <div className="flex justify-center items-center py-8">
          <Image
              src="/icons/icon-512x512.png"
              alt="logo"
              width={150}
              height={150}
              className="rounded-2xl shadow-xl"
          />
        </div>

        <div className="flex flex-col w-full gap-8 px-4 lg:px-8">
          <ActionCard
              title="새 모임 만들기"
              description="새로운 모임을 만들어 보세요"
              icon={CalendarPlus}
              iconBgColor="bg-main"
              buttonText="모임 만들기"
              buttonColor="bg-blue-500"
              buttonHoverColor="hover:bg-blue-300"
              href="/create-meeting"
          />
          <ActionCard
              title="모임 참여하기"
              description="초대받은 모임에 참여해보세요"
              icon={Users}
              iconBgColor="bg-green-100"
              buttonText="모임 참여하기"
              buttonColor="bg-green-500"
              buttonHoverColor="hover:bg-green-300"
              href="/join-meeting"
          />
        </div>

        <div className="fixed right-4 bottom-4">
          <HelpButton />
        </div>

      </div>
  );
}
