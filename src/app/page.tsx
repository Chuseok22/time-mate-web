import Image from "next/image";
import { CalendarPlus, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
      <div className="flex flex-col items-center bg-main gap-3 w-full py-20">
        <div className="flex justify-center, items-center text-5xl font-pacifico">
          meetTime
        </div>
        <div className="flex justify-center items-center text-lg">
          모임 시간을 쉽게 정해보세요
        </div>
        <div className="flex justify-center items-center py-8">
          <Image
              src="/icons/icon-512x512.png"
              alt="logo"
              width="150"
              height="150"
              className="rounded-2xl shadow-xl"
          />
        </div>

        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col bg-white w-full items-center rounded-2xl py-10 gap-6">
            <div className="flex flex-row w-10/12 items-center justify-center gap-3">
              <div className="flex flex-1 items-center justify-center">
                <div className="bg-main p-3.5 rounded-2xl">
                  <CalendarPlus />
                </div>
              </div>
              <div className="flex flex-col flex-5 gap-1">
                <div className="text-xl font-bold">
                  새 모임 만들기
                </div>
                <div>
                  새로운 모임을 만들어 보세요
                </div>
              </div>
            </div>
            <Link
                href="/create-meeting"
                className="bg-blue-500 text-white flex w-10/12 justify-center font-bold rounded-2xl py-3.5 hover:cursor-pointer hover:bg-blue-300 transition">
              모임 만들기
            </Link>
          </div>

          <div className="flex flex-col bg-white w-full items-center rounded-2xl py-10 gap-6">
            <div className="flex flex-row w-10/12 items-center justify-center gap-3">
              <div className="flex flex-1 items-center justify-center">
                <div className="bg-green-100 p-3.5 rounded-2xl">
                  <Users />
                </div>
              </div>
              <div className="flex flex-col flex-5 gap-1">
                <div className="text-xl font-bold">
                  모임 참여하기
                </div>
                <div>
                  초대받은 모임에 참여해보세요
                </div>
              </div>
            </div>
            <Link
                href="/join-meeting"
                className="bg-green-500 text-white flex w-10/12 justify-center font-bold rounded-2xl py-3.5 hover:cursor-pointer hover:bg-green-300 transition">
              모임 만들기
            </Link>
          </div>
        </div>


      </div>
  );
}
