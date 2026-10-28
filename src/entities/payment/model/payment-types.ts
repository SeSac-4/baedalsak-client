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
  /** 결제 요청 생성 시 가게명 스냅샷 */
  storeName: string;
  status: PaymentStatus;
  amount: number;
  /** ISO 8601, 승인 전이면 null */
  approvedAt: string | null;
}

/** GET /payments 응답. page는 0부터 */
export interface PaymentPage {
  content: PaymentSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /payments/{paymentId}·POST /payments/confirm 응답 */
export interface PaymentDetail {
  paymentId: number;
  orderId: number;
  status: PaymentStatus;
  amount: number;
  /** 결제수단 (토스 응답값, 승인 전이면 null) */
  method: string | null;
  /** ISO 8601, 승인 전이면 null */
  approvedAt: string | null;
  /** 영수증 링크 (승인 전이면 null) */
  receiptUrl: string | null;
  /** 카드사 승인번호 (카드 결제만 있음, 그 외·승인 전이면 null) */
  approvalNumber: string | null;
}
