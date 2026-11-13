import type { RiderDeliveryHistory } from '@/entities/delivery';

import { getKstDateKey } from './history-period';

const MINUTE_MS = 60_000;

/** 기간 요약 */
export interface HistorySummary {
  totalFee: number;
  count: number;
  /** 건이 없으면 0 */
  averageFee: number;
  /** 배차 ~ 완료 평균 분. 건이 없으면 0 */
  averageMinutes: number;
}

/** 하루 묶음 */
export interface HistoryDay {
  dateKey: string;
  totalFee: number;
  deliveries: RiderDeliveryHistory[];
}

/**
 * 배달 내역의 합계·건수·평균을 구한다.
 * @param deliveries - 완료한 배달 목록
 * @returns 기간 요약
 */
export const getHistorySummary = (deliveries: RiderDeliveryHistory[]): HistorySummary => {
  const count = deliveries.length;
  const totalFee = deliveries.reduce((sum, delivery) => sum + delivery.deliveryFee, 0);
  const totalMs = deliveries.reduce(
    (sum, delivery) => sum + (new Date(delivery.completedAt).getTime() - new Date(delivery.assignedAt).getTime()),
    0,
  );
  return {
    totalFee,
    count,
    averageFee: count === 0 ? 0 : Math.round(totalFee / count),
    averageMinutes: count === 0 ? 0 : Math.round(totalMs / count / MINUTE_MS),
  };
};

/**
 * 배달 내역을 완료한 한국 날짜별로 묶는다. 서버가 최근 완료 순으로 주므로 묶음도 최근 날짜 순이다.
 * @param deliveries - 완료한 배달 목록 (최근 완료 순)
 * @returns 날짜별 묶음
 */
export const getHistoryDayList = (deliveries: RiderDeliveryHistory[]): HistoryDay[] => {
  const days = new Map<string, HistoryDay>();
  deliveries.forEach((delivery) => {
    const dateKey = getKstDateKey(delivery.completedAt);
    const day = days.get(dateKey) ?? { dateKey, totalFee: 0, deliveries: [] };
    day.totalFee += delivery.deliveryFee;
    day.deliveries.push(delivery);
    days.set(dateKey, day);
  });
  return [...days.values()];
};
