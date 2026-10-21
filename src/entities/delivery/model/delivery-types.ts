/** 배달 상태: 배차대기 → 배차완료 → 픽업완료 → 배달완료 */
export type DeliveryStatus = 'WAITING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';

/** GET /deliveries/by-order/{orderId} 응답 */
export interface Delivery {
  id: number;
  orderId: number;
  status: DeliveryStatus;
  riderName: string | null;
  /** ISO 8601 */
  assignedAt: string | null;
  /** ISO 8601 */
  pickedUpAt: string | null;
  /** ISO 8601 */
  completedAt: string | null;
}
