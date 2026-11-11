import { useEffect, useEffectEvent, useState } from 'react';

/** useIntersection 옵션 */
export interface UseIntersectionOptions {
  /** false면 감지하지 않는다 (예: 다음 페이지를 받는 중) */
  enabled?: boolean;
  /** 화면에 닿기 전 미리 감지할 여백 (예: '200px') */
  rootMargin?: string;
}

/**
 * 요소가 화면에 보이면 onIntersect를 실행한다. 반환한 함수를 감지할 요소의 ref로 넘긴다.
 * enabled가 다시 true가 될 때 요소가 이미 보이고 있으면 곧바로 한 번 더 실행한다.
 * @param onIntersect - 요소가 보일 때 실행할 함수
 * @param options - enabled(감지 여부), rootMargin(미리 감지할 여백)
 * @returns 감지할 요소에 넘길 ref 함수
 */
export const useIntersection = (
  onIntersect: () => void,
  { enabled = true, rootMargin = '0px' }: UseIntersectionOptions = {},
): ((element: Element | null) => void) => {
  const [target, setTarget] = useState<Element | null>(null);
  const handleIntersect = useEffectEvent(onIntersect);

  useEffect(() => {
    if (!target || !enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) handleIntersect();
      },
      { rootMargin },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [target, enabled, rootMargin]);

  return setTarget;
};
