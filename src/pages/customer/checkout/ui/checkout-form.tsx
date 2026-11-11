import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useId, useState, type ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { cartKeys, getCartItemCount, type Cart } from '@/entities/cart';
import { PaymentMethodCard, useTossPayment, type TossPaymentMethod } from '@/features/payment/request-payment';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { FormField } from '@/shared/ui/form-field';
import { Input } from '@/shared/ui/input';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { useToast } from '@/shared/ui/toast';
import { CartAmountCard } from '@/widgets/cart-summary';

import type { CreatedOrder, CreateOrderRequest } from '../api/create-order-api';
import { checkoutSchema, type CheckoutFormValues } from '../model/checkout-schema';
import { useCreateOrder } from '../model/use-create-order';

export interface CheckoutFormProps {
  cart: Cart;
  /** 가입 시 휴대폰 번호 (읽기 전용 표시) */
  phone: string;
}

const CARD_CLASS = 'flex flex-col gap-3 p-5';
const CARD_TITLE_CLASS = 'font-bold text-fg';
const COLUMN_CLASS = 'flex min-w-0 flex-col gap-3 tablet:gap-3.5 desktop:gap-4';
const CART_PATH = '/cart';
const PAYMENT_SUCCESS_PATH = '/payment/success';
const PAYMENT_FAIL_PATH = '/payment/fail';
/** 결제 완료 화면이 결제 확인(POST /orders/{orderId}/payment/confirm)에 쓸 주문 ID 쿼리 이름 (payment-success-page.tsx와 같은 값) */
const ORDER_ID_PARAM = 'order';
const PAYMENT_REQUEST_ERROR_MESSAGE = '결제창을 열지 못했어요. 다시 시도해 주세요.';
/** PC에서 구매자가 토스 결제창을 닫으면 failUrl 대신 이 코드의 오류로 끝난다 */
const USER_CANCEL_CODE = 'USER_CANCEL';

/** 장바구니 가게가 폐업했거나 없어진 주문 실패 */
const STORE_NOT_FOUND = 'STORE_NOT_FOUND';
const STORE_NOT_FOUND_MESSAGE = '가게를 찾을 수 없어 주문할 수 없어요. 장바구니를 비우고 다른 가게에서 담아 주세요.';
/** 장바구니를 다시 확인해야 하는 주문 실패 (사유를 알리고 장바구니로 돌려보낸다) */
const CART_ERROR_CODES: readonly string[] = [
  'CART_EMPTY',
  'STORE_CLOSED',
  'MENU_NOT_ON_SALE',
  'MIN_ORDER_AMOUNT_NOT_MET',
  STORE_NOT_FOUND,
];

/** 서버 errors[].field → 폼 필드 */
const SERVER_FIELD_MAP: Record<string, Path<CheckoutFormValues>> = {
  deliveryAddress: 'address',
  deliveryDong: 'deliveryDong',
  storeRequest: 'storeRequest',
  riderRequest: 'riderRequest',
};

/**
 * 폼 값을 주문 생성 요청으로 바꾼다. 주소·상세 주소는 한 줄로 합치고, 빈 요청사항은 null.
 * @param values - 폼 값
 * @returns 주문 생성 요청 본문
 */
const parseRequest = (values: CheckoutFormValues): CreateOrderRequest => ({
  deliveryAddress: `${values.address} ${values.addressDetail}`.trim(),
  deliveryDong: values.deliveryDong,
  storeRequest: values.storeRequest || null,
  riderRequest: values.riderRequest || null,
});

/**
 * 구매자가 토스 결제창을 닫아 생긴 오류인지 확인한다.
 * @param error - 결제창 요청 오류
 * @returns 결제창 닫기 여부
 */
const isUserCancelError = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === USER_CANCEL_CODE;

/**
 * U-04 주문서·결제 폼. 배달 주소·동·요청사항과 결제 수단(신용·체크카드·토스페이)을 보여 준다.
 * 결제하기를 누르면 주문(POST /orders)을 한 번 만들고, 응답의 결제창 값으로 고른 수단의 토스 결제창을 연다.
 * 결제창을 닫으면 주문서에 그대로 머문다. 장바구니는 결제 완료 때 서버가 비운다.
 * 장바구니 문제(빈 장바구니·영업 종료·품절·최소주문 미달)면 사유를 알리고 장바구니로 돌려보낸다.
 * 진행 중인 결제(409 PAYMENT_IN_PROGRESS)·결제 요청 실패(503)는 서버 메시지로 알리고 주문서에 머문다.
 * @param props cart(주문할 장바구니), phone(연락처)
 * @returns 주문서 폼 요소
 */
export function CheckoutForm({ cart, phone }: CheckoutFormProps): ReactNode {
  const id = useId();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: createOrder } = useCreateOrder();
  const { status: paymentStatus, requestPayment } = useTossPayment();
  const [paymentMethod, setPaymentMethod] = useState<TossPaymentMethod>('CARD');
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { address: '', addressDetail: '', deliveryDong: '', storeRequest: '', riderRequest: '' },
  });

  const isPayable = paymentStatus === 'ready' && isAgreed;

  /**
   * 만든 주문의 결제창 값으로 토스 결제창을 연다. 결제 결과는 토스가 successUrl·failUrl로 이동시켜 전달한다.
   * 결제창을 닫으면 주문서에 머물고, 결제창을 열지 못하면 토스트로 알린다.
   * @param order - 만든 주문 (id, 결제창 값)
   */
  const openPaymentWindow = async ({ id: orderId, payment }: CreatedOrder): Promise<void> => {
    try {
      await requestPayment({
        method: paymentMethod,
        amount: payment.amount,
        orderId: payment.tossOrderId,
        orderName: payment.orderName,
        successUrl: `${window.location.origin}${PAYMENT_SUCCESS_PATH}?${ORDER_ID_PARAM}=${orderId}`,
        failUrl: `${window.location.origin}${PAYMENT_FAIL_PATH}`,
      });
    } catch (error: unknown) {
      if (isUserCancelError(error)) return;
      toast(error instanceof Error && error.message ? error.message : PAYMENT_REQUEST_ERROR_MESSAGE);
    }
  };

  /**
   * 주문을 만들고 토스 결제창을 연다. 주문 생성이 실패하면 에러 종류에 맞게 안내한다.
   * 가게가 없으면(폐업) 장바구니 비우기를 안내하고 장바구니로 돌려보낸다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: CheckoutFormValues): Promise<void> => {
    if (!isPayable) return;
    try {
      const order = await createOrder(parseRequest(values));
      await openPaymentWindow(order);
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length > 0) {
        fieldErrors.forEach(({ field, reason }) => setError(SERVER_FIELD_MAP[field] ?? 'root', { message: reason }));
        return;
      }
      const errorCode = getErrorCode(error) ?? '';
      toast(errorCode === STORE_NOT_FOUND ? STORE_NOT_FOUND_MESSAGE : getErrorMessage(error));
      if (CART_ERROR_CODES.includes(errorCode)) {
        navigate(CART_PATH, { replace: true });
        await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div className='mx-auto flex w-full flex-col gap-3 px-4 pt-1 pb-6 tablet:max-w-[760px] tablet:gap-3.5 tablet:px-6 tablet:pt-5 tablet:pb-10 desktop:max-w-[1180px] desktop:gap-4 desktop:px-10 desktop:pt-7 desktop:pb-12'>
        <div>
          <Link
            to={CART_PATH}
            className='inline-flex min-h-11 items-center text-note text-fg-muted hover:text-fg'
          >
            ‹ 장바구니
          </Link>
          <PageHeader title='주문하기' />
        </div>

        <div className='flex flex-col gap-3 tablet:gap-3.5 desktop:grid desktop:grid-cols-[minmax(0,1fr)_340px] desktop:items-start desktop:gap-6'>
          <div className={COLUMN_CLASS}>
            <Card
              padding='none'
              className={CARD_CLASS}
            >
              <h2 className={CARD_TITLE_CLASS}>배달 정보</h2>
              <FormField
                id={`${id}-address`}
                label='주소'
                error={errors.address?.message}
              >
                <Input
                  id={`${id}-address`}
                  placeholder='예: 서울 성동구 성수이로 113'
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={`${id}-address-message`}
                  {...register('address')}
                />
              </FormField>
              <div className='grid grid-cols-2 items-start gap-2'>
                <FormField
                  id={`${id}-detail`}
                  label='상세 주소'
                  error={errors.addressDetail?.message}
                >
                  <Input
                    id={`${id}-detail`}
                    placeholder='예: 302호'
                    aria-invalid={Boolean(errors.addressDetail)}
                    aria-describedby={`${id}-detail-message`}
                    {...register('addressDetail')}
                  />
                </FormField>
                <FormField
                  id={`${id}-dong`}
                  label='동'
                  error={errors.deliveryDong?.message}
                >
                  <Input
                    id={`${id}-dong`}
                    maxLength={50}
                    placeholder='예: 성수동2가'
                    aria-invalid={Boolean(errors.deliveryDong)}
                    aria-describedby={`${id}-dong-message`}
                    {...register('deliveryDong')}
                  />
                </FormField>
              </div>
              <p className='text-note text-fg-muted'>동은 라이더 배차 목록에 배달지로 보여요.</p>
              <div className='flex justify-between gap-3 border-t border-border pt-3'>
                <span className='text-fg-muted'>연락처</span>
                <span className='text-fg tabular-nums'>{phone}</span>
              </div>
            </Card>

            <Card
              padding='none'
              className={CARD_CLASS}
            >
              <h2 className={CARD_TITLE_CLASS}>요청사항</h2>
              <FormField
                id={`${id}-store-request`}
                label='가게 사장님께'
                error={errors.storeRequest?.message}
              >
                <Input
                  id={`${id}-store-request`}
                  maxLength={200}
                  placeholder='예: 김밥 썰어 주세요'
                  aria-invalid={Boolean(errors.storeRequest)}
                  aria-describedby={`${id}-store-request-message`}
                  {...register('storeRequest')}
                />
              </FormField>
              <FormField
                id={`${id}-rider-request`}
                label='라이더님께'
                error={errors.riderRequest?.message}
              >
                <Input
                  id={`${id}-rider-request`}
                  maxLength={200}
                  placeholder='예: 문 앞에 두고 벨 눌러 주세요'
                  aria-invalid={Boolean(errors.riderRequest)}
                  aria-describedby={`${id}-rider-request-message`}
                  {...register('riderRequest')}
                />
              </FormField>
            </Card>

            <section aria-label='결제 방법'>
              <PaymentMethodCard
                status={paymentStatus}
                method={paymentMethod}
                onMethodChange={setPaymentMethod}
                onAgreedChange={setIsAgreed}
              >
                <p className='border-t border-border pt-3 text-note text-fg-muted'>
                  테스트 환경이라 실제 출금은 없어요.
                </p>
              </PaymentMethodCard>
            </section>

            {errors.root ? (
              <Notice
                tone='warn'
                role='alert'
              >
                {errors.root.message}
              </Notice>
            ) : null}
          </div>

          <div className={`${COLUMN_CLASS} desktop:sticky desktop:top-30`}>
            <Card
              padding='none'
              className='p-5'
            >
              <div className='mb-2.5 flex items-center gap-2'>
                <h2 className={`${CARD_TITLE_CLASS} min-w-0 flex-1 wrap-break-word`}>{cart.storeName}</h2>
                <span className='flex-none text-note text-fg-muted'>메뉴 {getCartItemCount(cart)}개</span>
              </div>
              <ul className='flex flex-col gap-2 tabular-nums'>
                {cart.items.map((item) => (
                  <li
                    key={item.menuId}
                    className='flex gap-2'
                  >
                    <span className='min-w-0 flex-1 wrap-break-word text-fg'>{item.menuName}</span>
                    <span className='flex-none text-fg-muted'>{item.quantity}개</span>
                    <span className='min-w-19 flex-none text-right text-fg'>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <CartAmountCard
              cart={cart}
              title='결제 금액'
            />
            <Button
              type='submit'
              size='lg'
              block
              disabled={isSubmitting || !isPayable}
              className='hidden desktop:inline-flex'
            >
              {formatPrice(cart.totalAmount)} 결제하기
            </Button>
          </div>
        </div>
      </div>

      <div className='sticky bottom-0 z-10 flex items-center gap-3.5 border-t border-border bg-surface px-4 pt-3 pb-6 tablet:px-[calc(50%-356px)] desktop:hidden'>
        <div className='flex flex-none flex-col leading-[1.3]'>
          <span className='text-note text-fg-muted'>총 결제 금액</span>
          <span className='text-title font-bold text-fg tabular-nums'>{formatPrice(cart.totalAmount)}</span>
        </div>
        <Button
          type='submit'
          size='lg'
          block
          disabled={isSubmitting || !isPayable}
        >
          결제하기
        </Button>
      </div>
    </form>
  );
}
