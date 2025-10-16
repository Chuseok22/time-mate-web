interface InviteTemplateParams {
  title: string,
  url: string,
  joinCode: string;
}

export function generateInviteMessage({
  title,
  url,
  joinCode,
}: InviteTemplateParams): string {
  return `🗓️ 모임에 초대합니다!
  제목: ${title}
  
📱 MeetTime 앱에서 참여해주세요
  [${url}]
  
🔑 모임 코드: ${joinCode}
  `
}