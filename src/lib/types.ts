const ORIGIN_URL = process.env.ORIGIN_URL
const API_BASE_URL = process.env.API_BASE_URL

if (!ORIGIN_URL) {
  throw new Error('ORIGIN_URL 환경 변수가 설정되지 않았습니다.');
}

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL 환경 변수가 설정되지 않았습니다.');
}

export { ORIGIN_URL, API_BASE_URL };