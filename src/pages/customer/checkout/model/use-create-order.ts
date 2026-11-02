import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { createOrder, type CreatedOrder, type CreateOrderRequest } from '../api/create-order-api';

/**
 * 주문 생성. 결과 처리(결제 화면 이동·에러별 안내)는 주문서 폼이 맡는다.
 * @returns 주문 생성 mutation
 */
export const useCreateOrder = (): UseMutationResult<CreatedOrder, unknown, CreateOrderRequest> =>
  useMutation({ mutationFn: createOrder });
