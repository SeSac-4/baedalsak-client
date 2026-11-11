import { useEffect, useState } from 'react';

/** 남은 시간 카운트다운 */
export interface Countdown {
  /** 남은 초 (멈춰 있으면 0) */
  seconds: number;
  /** 지금부터 seconds초 카운트다운을 시작한다 (진행 중이면 다시 시작) */
  start: (seconds: number) => void;
  /** 카운트다운을 멈추고 0으로 만든다 */
  stop: () => void;
}

const TICK_MS = 250;

/**
 * 초 단위 카운트다운. 끝나는 시각을 기억해 두고 계산해서, 탭이 잠깐 멈췄다 돌아와도 남은 시간이 맞다.
 * @returns 남은 초와 시작·멈춤 함수
 */
export const useCountdown = (): Countdown => {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    if (endAt === null) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endAt) setEndAt(null);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [endAt]);

  /**
   * 카운트다운을 시작한다.
   * @param seconds - 남은 초
   */
  const start = (seconds: number): void => {
    const current = Date.now();
    setNow(current);
    setEndAt(current + seconds * 1000);
  };

  /** 카운트다운을 멈춘다 */
  const stop = (): void => setEndAt(null);

  return { seconds: endAt === null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000)), start, stop };
};
