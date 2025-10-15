import Header from "@/components/Header";
import BodySection from "@/components/BodySection";
import JoinCodeForm from "@/features/join-meeting/components/JoinCodeForm";

export default function JoinMeetingPage() {
  return (
      <div className="min-h-screen bg-main">
        <Header title="모임 참여하기" />
        <main className="main-container">
          <BodySection>
            <div className="flex flex-col w-full gap-4">
              <h2 className="text-xl font-semibold">모임 참여</h2>

              <JoinCodeForm />
            </div>
          </BodySection>
        </main>
      </div>
  )
};