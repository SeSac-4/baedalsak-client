const KST_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/**
 * ISO 시각을 KST 'MM.DD HH:mm'으로 표시한다.
 * @param iso ISO 8601 시각
 * @returns 예: 10.13 12:30
 */
export const formatDateTime = (iso: string): string => {
  const parts = KST_FORMATTER.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes): string => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('month')}.${get('day')} ${get('hour')}:${get('minute')}`;
};
