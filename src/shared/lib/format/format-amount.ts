/**
 * 금액을 입력칸 표시용 문자열로 바꾼다 (12000 → '12,000', 비어 있으면 '').
 * @param value - 금액 (비어 있으면 undefined 또는 NaN)
 * @returns 쉼표를 넣은 금액 문자열
 */
export const formatAmount = (value: number | undefined): string =>
  value === undefined || Number.isNaN(value) ? '' : value.toLocaleString('ko-KR');

/**
 * 입력한 글자에서 숫자만 남겨 금액으로 바꾼다 (비어 있으면 NaN → 검증에서 걸린다).
 * @param text - 입력한 글자
 * @returns 금액
 */
export const parseAmount = (text: string): number => {
  const digits = text.replace(/\D/g, '');
  return digits === '' ? Number.NaN : Number(digits);
};
