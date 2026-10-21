import type { PaymentDetail } from './payment-types';

/** 영수증 링크 자리 (API 연동 전 임시) */
const RECEIPT_URL_MOCK = 'https://dashboard.tosspayments.com/receipt';

/** 화면 확인용 내 결제 목록 — 주문 1001~1004의 승인 완료 결제, 최신순 (API 연동 전 임시) */
export const PAYMENT_LIST_MOCK: PaymentDetail[] = [
  {
    paymentId: 504,
    orderId: 1004,
    status: 'APPROVED',
    amount: 18000,
    method: '카드',
    approvalNumber: '30022504',
    approvedAt: '2026-10-13T12:41:00+09:00',
    receiptUrl: RECEIPT_URL_MOCK,
  },
  {
    paymentId: 503,
    orderId: 1003,
    status: 'APPROVED',
    amount: 18000,
    method: '간편결제',
    approvalNumber: '30022503',
    approvedAt: '2026-10-13T12:31:00+09:00',
    receiptUrl: RECEIPT_URL_MOCK,
  },
  {
    paymentId: 502,
    orderId: 1002,
    status: 'APPROVED',
    amount: 18000,
    method: '카드',
    approvalNumber: '30022502',
    approvedAt: '2026-10-13T11:51:00+09:00',
    receiptUrl: RECEIPT_URL_MOCK,
  },
  {
    paymentId: 501,
    orderId: 1001,
    status: 'APPROVED',
    amount: 18000,
    method: '카드',
    approvalNumber: '30022501',
    approvedAt: '2026-10-12T18:21:00+09:00',
    receiptUrl: RECEIPT_URL_MOCK,
  },
];

/**
 * 결제 ID로 목 결제 상세를 찾는다.
 * @param paymentId 결제 ID
 * @returns 결제 상세 (없으면 undefined)
 */
export const getPaymentMock = (paymentId: number): PaymentDetail | undefined =>
  PAYMENT_LIST_MOCK.find((payment) => payment.paymentId === paymentId);
