/** 400 VALIDATION_FAILED의 필드별 오류 */
export interface ApiFieldError {
  field: string;
  reason: string;
}

/** 서버 에러 응답 본문. message는 사용자에게 그대로 보여 줘도 되는 한국어 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  errors?: ApiFieldError[];
  traceId?: string;
}
