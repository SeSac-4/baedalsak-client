import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { cartKeys, type Cart } from '@/entities/cart';
import { getErrorCode, getErrorMessage, getFieldErrors } from '@/shared/api';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { useToast } from '@/shared/ui/toast';

import type { CreateOrderRequest } from '../api/create-order-api';
import { checkoutSchema, type CheckoutFormValues } from '../model/checkout-schema';
import { useCreateOrder } from '../model/use-create-order';

export interface CheckoutFormProps {
  cart: Cart;
  /** 가입 시 휴대폰 번호 (읽기 전용 표시) */
  phone: string;
}

const LABEL_CLASS = 'flex flex-col gap-1 text-note font-medium text-fg-muted';
const ERROR_CLASS = 'text-note text-warn';
const CART_PATH = '/cart';

/** 장바구니를 다시 확인해야 하는 주문 실패 (사유를 알리고 장바구니로 돌려보낸다) */
const CART_ERROR_CODES: readonly string[] = [
  'CART_EMPTY',
  'STORE_CLOSED',
  'MENU_NOT_ON_SALE',
  'MIN_ORDER_AMOUNT_NOT_MET',
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
 * U-04 주문서 폼. 배달 주소·동·요청사항을 받아 주문(POST /orders)을 만들고, 받은 주문 ID로 결제 화면에 간다.
 * 장바구니 문제(빈 장바구니·영업 종료·품절·최소주문 미달)면 사유를 알리고 장바구니로 돌려보낸다.
 * @param props cart(주문할 장바구니), phone(연락처)
 * @returns 주문서 폼 요소
 */
export function CheckoutForm({ cart, phone }: CheckoutFormProps): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: createOrder } = useCreateOrder();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { address: '', addressDetail: '', deliveryDong: '', storeRequest: '', riderRequest: '' },
  });

  /**
   * 장바구니 캐시를 낡은 것으로 표시한다. 지금 보고 있는 주문서가 다시 조회해 장바구니로 튕기지 않도록 다음 진입 때 받는다.
   */
  const setCartStale = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: cartKeys.all, refetchType: 'none' });
  };

  /**
   * 주문을 만들고 결제 화면으로 간다. 실패하면 에러 종류에 맞게 안내한다.
   * @param values - 검증을 통과한 폼 값
   */
  const handleValidSubmit = async (values: CheckoutFormValues): Promise<void> => {
    try {
      const order = await createOrder(parseRequest(values));
      navigate(`/payment/${order.id}`);
      await setCartStale();
    } catch (error: unknown) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length > 0) {
        fieldErrors.forEach(({ field, reason }) => setError(SERVER_FIELD_MAP[field] ?? 'root', { message: reason }));
        return;
      }
      toast(getErrorMessage(error));
      if (CART_ERROR_CODES.includes(getErrorCode(error) ?? '')) {
        navigate(CART_PATH, { replace: true });
        await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
      className='grid gap-4 tablet:grid-cols-[1fr_300px] tablet:items-start'
    >
      <div className='flex flex-col gap-4'>
        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>배달 주소</strong>
          <div className='grid gap-3 tablet:grid-cols-2'>
            <label className={`${LABEL_CLASS} tablet:col-span-2`}>
              주소
              <Input
                placeholder='예: 서울 성동구 성수이로 113'
                aria-invalid={Boolean(errors.address)}
                {...register('address')}
              />
              {errors.address ? <span className={ERROR_CLASS}>{errors.address.message}</span> : null}
            </label>
            <label className={LABEL_CLASS}>
              상세 주소
              <Input
                placeholder='예: 302호'
                aria-invalid={Boolean(errors.addressDetail)}
                {...register('addressDetail')}
              />
              {errors.addressDetail ? <span className={ERROR_CLASS}>{errors.addressDetail.message}</span> : null}
            </label>
            <label className={LABEL_CLASS}>
              동
              <Input
                maxLength={50}
                placeholder='예: 성수동2가'
                aria-invalid={Boolean(errors.deliveryDong)}
                {...register('deliveryDong')}
              />
              {errors.deliveryDong ? <span className={ERROR_CLASS}>{errors.deliveryDong.message}</span> : null}
            </label>
            <label className={LABEL_CLASS}>
              연락처
              <Input
                name='phone'
                value={phone}
                readOnly
              />
            </label>
          </div>
          <p className='text-note text-fg-subtle'>동은 라이더 배차 목록에 배달지로 보여요.</p>
        </Card>

        <Card className='flex flex-col gap-3'>
          <strong className='text-body text-fg'>요청사항</strong>
          <div className='grid gap-3 tablet:grid-cols-2'>
            <label className={LABEL_CLASS}>
              가게 사장님께
              <Input
                maxLength={200}
                placeholder='예: 김밥 썰어 주세요'
                aria-invalid={Boolean(errors.storeRequest)}
                {...register('storeRequest')}
              />
              {errors.storeRequest ? <span className={ERROR_CLASS}>{errors.storeRequest.message}</span> : null}
            </label>
            <label className={LABEL_CLASS}>
              라이더님께
              <Input
                maxLength={200}
                placeholder='예: 문 앞에 두고 벨 눌러 주세요'
                aria-invalid={Boolean(errors.riderRequest)}
                {...register('riderRequest')}
              />
              {errors.riderRequest ? <span className={ERROR_CLASS}>{errors.riderRequest.message}</span> : null}
            </label>
          </div>
        </Card>
        {errors.root ? <p className={ERROR_CLASS}>{errors.root.message}</p> : null}
      </div>

      <aside className='tablet:sticky tablet:top-4'>
        <Card className='flex flex-col gap-2'>
          <strong className='text-body text-fg'>{cart.storeName}</strong>
          <ul className='flex flex-col gap-1 text-note tabular-nums'>
            {cart.items.map((item) => (
              <li
                key={item.menuId}
                className='flex justify-between gap-2'
              >
                <span className='text-fg'>
                  {item.menuName} × {item.quantity}
                </span>
                <span className='text-fg'>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
            <li className='flex justify-between gap-2'>
              <span className='text-fg-muted'>배달비</span>
              <span className='text-fg'>{formatPrice(cart.deliveryFee)}</span>
            </li>
          </ul>
          <div className='flex justify-between border-t border-border pt-2 text-body font-bold tabular-nums'>
            <span className='text-fg'>결제 금액</span>
            <span className='text-fg'>{formatPrice(cart.totalAmount)}</span>
          </div>
          <Button
            type='submit'
            size='lg'
            block
            disabled={isSubmitting}
          >
            결제하기
          </Button>
        </Card>
      </aside>
    </form>
  );
}
