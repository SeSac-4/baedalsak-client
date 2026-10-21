/** 결제 상태: 결제 요청됨 → 승인완료 */
export type PaymentStatus = 'REQUESTED' | 'APPROVED';

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
  /** 카드사 승인번호 (서버 응답 필드 미정, 이슈 #24 화면 기준) */
  approvalNumber: string | null;
  /** 영수증 링크 (승인 전이면 null) */
  receiptUrl: string | null;
}
