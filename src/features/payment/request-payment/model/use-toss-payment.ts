import { ANONYMOUS, loadTossPayments, type TossPaymentsPayment } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

/** 결제창(구버전) 연동 클라이언트 키 — API 개별 연동 키 (테스트 환경) */
const TOSS_CLIENT_KEY: string = import.meta.env.VITE_TOSS_CLIENT_KEY ?? '';
/**
 * 구매자가 고르는 결제 수단. 카드는 카드/간편결제 통합결제창을 열고, 나머지는 토스 간편결제사 코드로 그 간편결제 자체창을 연다.
 * 테스트 키로 결제할 수 있는 간편결제만 둔다 (카카오페이는 계약 뒤 상점 키, 페이코는 라이브 키에서만 — 토스 '환경 설정하기')
 */
export type TossPaymentMethod = 'CARD' | 'TOSSPAY' | 'NAVERPAY' | 'SAMSUNGPAY' | 'SSG';

/** 결제창 준비 상태 */
export type TossPaymentStatus = 'loading' | 'ready' | 'error';

/** 토스 결제창 요청 정보. 결과는 successUrl·failUrl로 페이지를 이동해 받는다 */
export interface TossPaymentRequest {
  /** 고른 결제 수단 */
  method: TossPaymentMethod;
  /** 서버가 정한 결제 금액 */
  amount: number;
  /** 서버가 준 tossOrderId */
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
}

export interface TossPaymentState {
  status: TossPaymentStatus;
  /** 토스 결제창을 띄운다. 준비가 끝나기 전에는 아무것도 하지 않는다 */
  requestPayment: (request: TossPaymentRequest) => Promise<void>;
}

/** 불러온 결제창 객체와 화면 유지 여부. 화면을 벗어난 뒤 도착한 SDK 결과는 버린다 */
interface LoadedPayment {
  isMounted: boolean;
  payment: TossPaymentsPayment | null;
}

/**
 * 결제 수단에 맞는 카드 결제 옵션을 만든다.
 * @param method 고른 결제 수단
 * @returns 통합결제창(DEFAULT) 또는 간편결제 자체창(DIRECT) 옵션
 */
const getCardOption = (method: TossPaymentMethod): { flowMode: 'DEFAULT' | 'DIRECT'; easyPay?: string } =>
  method === 'CARD' ? { flowMode: 'DEFAULT' } : { flowMode: 'DIRECT', easyPay: method };

/**
 * 토스 결제창(구버전)을 준비하고 준비 상태와 결제창 호출 함수를 돌려준다. 비회원(ANONYMOUS)으로 초기화한다.
 * 결제 수단 UI는 우리 화면이 그리고, 결제하기를 누르면 고른 수단의 토스 결제창이 열린다.
 * 화면을 벗어나면 열린 결제창을 닫는다. 주문서(U-04)와 결제 화면(U-05)이 함께 쓴다.
 * @returns 준비 상태, 결제창 호출 함수
 */
export const useTossPayment = (): TossPaymentState => {
  const [status, setStatus] = useState<TossPaymentStatus>('loading');
  const [payment, setPayment] = useState<TossPaymentsPayment | null>(null);

  /**
   * 고른 결제 수단의 토스 결제창을 띄운다.
   * @param request 결제창 요청 정보
   */
  const requestPayment = async ({ method, amount, ...request }: TossPaymentRequest): Promise<void> => {
    if (!payment) return;
    await payment.requestPayment({
      ...request,
      method: 'CARD',
      amount: { currency: 'KRW', value: amount },
      card: getCardOption(method),
    });
  };

  useEffect(() => {
    const loaded: LoadedPayment = { isMounted: true, payment: null };

    loadTossPayments(TOSS_CLIENT_KEY)
      .then((tossPayments): void => {
        if (!loaded.isMounted) return;
        loaded.payment = tossPayments.payment({ customerKey: ANONYMOUS });
        setPayment(loaded.payment);
        setStatus('ready');
      })
      .catch((): void => {
        if (loaded.isMounted) setStatus('error');
      });

    return (): void => {
      loaded.isMounted = false;
      loaded.payment?.destroy().catch((): void => undefined);
    };
  }, []);

  return { status, requestPayment };
};
