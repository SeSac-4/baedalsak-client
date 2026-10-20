/**
 * 금액을 천 단위 콤마 + '원'으로 표시한다.
 * @param amount 원 단위 금액
 * @returns 예: 12,000원
 */
export const formatPrice = (amount: number): string => `${amount.toLocaleString('ko-KR')}원`;
