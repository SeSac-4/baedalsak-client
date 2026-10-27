/** 결제 상태: 결제 요청됨 → 승인완료 */
export type PaymentStatus = 'REQUESTED' | 'APPROVED';

/** POST /payments 응답. 토스 결제창 호출에 쓰는 결제 요청 정보 */
export interface PaymentReady {
  paymentId: number;
  /** 토스 orderId (6~64자, 영문·숫자·-·_) */
  tossOrderId: string;
  /** 토스 orderName (최대 100자) */
  orderName: string;
  amount: number;
}

/** GET /payments 응답 항목 */
export interface PaymentSummary {
  paymentId: number;
  status: PaymentStatus;
  amount: number;
  /** ISO 8601, 승인 전이면 null */
  approvedAt: string | null;
}

/** GET /payments/{paymentId} 응답 */
export interface PaymentDetail extends PaymentSummary {
  orderId: number;
  /** 결제수단 (토스 응답값, 승인 전이면 null) */
  method: string | null;
  /** 카드사 승인번호 (서버 응답에는 server #16 이후 추가, 그 전에는 없음) */
  approvalNumber?: string | null;
  /** 영수증 링크 (승인 전이면 null) */
  receiptUrl: string | null;
}
