/** POST /orders/{orderId}/payment/confirm 요청. 토스 successUrl 쿼리 값과 주문서가 붙여 둔 주문 ID */
export interface ConfirmPaymentRequest {
  /** DB 주문 ID (주문서가 successUrl에 붙여 둔 값) */
  orderId: number;
  paymentKey: string;
  amount: number;
}
