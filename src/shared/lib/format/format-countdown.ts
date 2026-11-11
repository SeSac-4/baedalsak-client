/**
 * 남은 초를 `분:초`로 바꾼다 (예: 59 → '0:59', 125 → '2:05').
 * @param seconds - 남은 초
 * @returns 표시용 문자열
 */
export const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};
