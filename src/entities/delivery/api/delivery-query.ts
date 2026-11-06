/** 배달 쿼리 키 팩토리 */
export const deliveryKeys = {
  all: ['delivery'] as const,
  /**
   * 배차 대기 목록 키를 만든다.
   * @returns 쿼리 키
   */
  waiting: () => [...deliveryKeys.all, 'waiting'] as const,
  /**
   * 내 진행 중 배달(라이더) 키를 만든다.
   * @returns 쿼리 키
   */
  active: () => [...deliveryKeys.all, 'active'] as const,
  /**
   * 주문의 배달 상태 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  byOrder: (orderId: number) => [...deliveryKeys.all, 'by-order', orderId] as const,
  /**
   * 주문의 배달 경로 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  route: (orderId: number) => [...deliveryKeys.all, 'route', orderId] as const,
  /**
   * 주문의 라이더 위치 키를 만든다.
   * @param orderId - 주문 ID
   * @returns 쿼리 키
   */
  location: (orderId: number) => [...deliveryKeys.all, 'location', orderId] as const,
};
