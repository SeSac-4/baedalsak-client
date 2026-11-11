import { useEffect, useState } from 'react';

/**
 * 값이 delay 동안 바뀌지 않으면 그 값을 돌려준다. 입력할 때마다 요청하지 않도록 검색어 등에 쓴다.
 * @param value - 따라갈 값
 * @param delay - 기다릴 시간(ms, 기본 300)
 * @returns 마지막으로 delay 동안 유지된 값
 */
export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
