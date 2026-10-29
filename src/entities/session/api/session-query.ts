/** 세션 쿼리 키 팩토리 */
export const sessionKeys = {
  all: ['session'] as const,
  /**
   * 내 정보 키를 만든다.
   * @returns 쿼리 키
   */
  me: () => [...sessionKeys.all, 'me'] as const,
};
