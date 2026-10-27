import {
  ANONYMOUS,
  loadTossPayments,
  type TossPaymentsWidgets,
  type WidgetAgreementStatus,
  type WidgetAgreementWidget,
  type WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

/** 결제위젯 연동 클라이언트 키 (테스트 환경) */
const TOSS_CLIENT_KEY: string = import.meta.env.VITE_TOSS_CLIENT_KEY ?? '';

/** 결제 UI를 그릴 요소 선택자. 토스는 한 페이지에 결제 UI를 하나만 허용한다 */
export const PAYMENT_METHOD_SELECTOR = '#toss-payment-method';
/** 약관 UI를 그릴 요소 선택자 */
export const AGREEMENT_SELECTOR = '#toss-agreement';

/** 결제위젯 렌더링 상태 */
export type TossPaymentWidgetStatus = 'loading' | 'ready' | 'error';

/** 토스 결제창 요청 정보. 결과는 successUrl·failUrl로 페이지를 이동해 받는다 */
export interface TossPaymentRequest {
  /** 결제 요청 API가 준 tossOrderId */
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
}

export interface TossPaymentWidgetState {
  status: TossPaymentWidgetStatus;
  /** 필수 약관에 모두 동의했는지 */
  isAgreed: boolean;
  /** 토스 결제창을 띄운다. 위젯 렌더링이 끝나기 전에는 아무것도 하지 않는다 */
  requestPayment: (request: TossPaymentRequest) => Promise<void>;
}

interface RenderedWidgets {
  isMounted: boolean;
  paymentMethod: WidgetPaymentMethodWidget | null;
  agreement: WidgetAgreementWidget | null;
}

/** 렌더링·정리 작업을 순서대로 실행하는 대기열. 다시 마운트될 때 이전 위젯이 지워진 뒤에 그린다 */
const widgetTaskQueue: { current: Promise<void> } = { current: Promise.resolve() };

/**
 * 위젯 작업을 대기열 끝에 추가한다.
 * @param task 실행할 작업
 */
const enqueueWidgetTask = (task: () => Promise<void>): void => {
  widgetTaskQueue.current = widgetTaskQueue.current.then(task).catch((): void => undefined);
};

/**
 * 렌더링한 결제 UI·약관 UI를 지운다.
 * @param rendered 렌더링한 위젯
 */
const destroyWidgets = async (rendered: RenderedWidgets): Promise<void> => {
  await rendered.paymentMethod?.destroy();
  await rendered.agreement?.destroy();
};

/**
 * 토스 결제위젯(결제 UI·약관 UI)을 그리고 렌더링 상태·약관 동의 여부·결제창 호출 함수를 돌려준다. 비회원(ANONYMOUS)으로 초기화한다.
 * 화면을 벗어나면 위젯을 지운다.
 * @param amount 결제 금액 (원)
 * @returns 렌더링 상태, 약관 동의 여부, 결제창 호출 함수
 */
export const useTossPaymentWidget = (amount: number): TossPaymentWidgetState => {
  const [status, setStatus] = useState<TossPaymentWidgetStatus>('loading');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  /**
   * 렌더링된 결제위젯으로 토스 결제창을 띄운다.
   * @param request 결제창 요청 정보
   */
  const requestPayment = async (request: TossPaymentRequest): Promise<void> => {
    if (!widgets) return;
    await widgets.requestPayment(request);
  };

  useEffect(() => {
    const rendered: RenderedWidgets = { isMounted: true, paymentMethod: null, agreement: null };

    enqueueWidgetTask(async (): Promise<void> => {
      if (!rendered.isMounted) return;
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const tossWidgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        await tossWidgets.setAmount({ currency: 'KRW', value: amount });
        rendered.paymentMethod = await tossWidgets.renderPaymentMethods({ selector: PAYMENT_METHOD_SELECTOR });
        rendered.agreement = await tossWidgets.renderAgreement({ selector: AGREEMENT_SELECTOR });
        rendered.agreement.on('agreementStatusChange', (agreementStatus: WidgetAgreementStatus): void => {
          setIsAgreed(agreementStatus.agreedRequiredTerms);
        });
        if (!rendered.isMounted) return;
        // 처음 상태를 읽는 API가 없어, 기본 약관 UI처럼 필수 약관 동의 상태로 시작한다
        setIsAgreed(true);
        setWidgets(tossWidgets);
        setStatus('ready');
      } catch {
        if (rendered.isMounted) setStatus('error');
      }
    });

    return (): void => {
      rendered.isMounted = false;
      enqueueWidgetTask(() => destroyWidgets(rendered));
    };
  }, [amount]);

  return { status, isAgreed, requestPayment };
};
