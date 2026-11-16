/** 이 거리(m)부터 km로 표시한다 */
const KM_THRESHOLD_M = 1000;

/**
 * 가게까지 거리를 표시용 문구로 바꾼다. 1km 미만은 m, 이상은 소수 첫째 자리 km (끝자리 0은 뺀다).
 * @param distanceM - 거리 (m)
 * @returns 예: 350m, 1.2km, 3km
 */
export const formatDistance = (distanceM: number): string =>
  distanceM < KM_THRESHOLD_M ? `${distanceM}m` : `${Number((distanceM / KM_THRESHOLD_M).toFixed(1))}km`;
