/** 서버 에러 응답 본문. 형식이 확정되지 않아 message만 선택적으로 읽는다 */
export interface ApiErrorResponse {
  message?: string;
}
