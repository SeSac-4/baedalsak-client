import { formatTime } from '@/shared/lib/format';

import type { RiderLocation } from '../model/delivery-types';

const MINUTE_MS = 60_000;
const METERS_PER_KM = 1_000;
/** 1km 미만은 10m 단위로 */
const SHORT_DISTANCE_STEP_M = 10;

/**
 * 남은 거리를 표시용으로 바꾼다.
 * @param meters - 거리 (m)
 * @returns 예: 1.2km, 350m
 */
export const formatDistance = (meters: number): string =>
  meters >= METERS_PER_KM
    ? `${(meters / METERS_PER_KM).toFixed(1)}km`
    : `${Math.round(meters / SHORT_DISTANCE_STEP_M) * SHORT_DISTANCE_STEP_M}m`;

/**
 * 도착 예정 시각까지 남은 분을 구한다. 1분 미만이면 1분.
 * @param etaAt - ISO 8601 도착 예정 시각
 * @returns 남은 분 (올림, 최소 1)
 */
export const getEtaMinutesLeft = (etaAt: string): number =>
  Math.max(1, Math.ceil((new Date(etaAt).getTime() - Date.now()) / MINUTE_MS));

/**
 * 남은 거리·시간 안내 (사장님·라이더). 도착했으면 도착 안내.
 * @param location - 라이더 위치
 * @returns 예: 약 1.2km · 6분 남음 / 배달지에 도착했어요 (경로를 모르면 null)
 */
export const formatRemaining = (location: RiderLocation): string | null => {
  if (location.arrived) return '배달지에 도착했어요';
  if (location.remainingDistanceM === null || !location.etaAt) return null;
  return `약 ${formatDistance(location.remainingDistanceM)} · ${getEtaMinutesLeft(location.etaAt)}분 남음`;
};

/**
 * 도착 예정 안내 (고객). 도착했으면 도착 안내.
 * @param location - 라이더 위치
 * @returns 예: 도착 예상 12:48 · 약 1.2km 남음 / 라이더가 도착했어요 (경로를 모르면 null)
 */
export const formatEta = (location: RiderLocation): string | null => {
  if (location.arrived) return '라이더가 도착했어요';
  if (location.remainingDistanceM === null || !location.etaAt) return null;
  return `도착 예상 ${formatTime(location.etaAt)} · 약 ${formatDistance(location.remainingDistanceM)} 남음`;
};
