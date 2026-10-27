/** POST /payments/confirm 요청. 토스 successUrl 쿼리 값을 그대로 전달한다 */
export interface ConfirmPaymentRequest {
  paymentKey: string;
  /** 토스 orderId (= 결제 요청 API의 tossOrderId) */
  orderId: string;
  amount: number;
}
