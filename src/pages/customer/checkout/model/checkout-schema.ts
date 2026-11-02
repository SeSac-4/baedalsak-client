import { z } from 'zod';

const DELIVERY_ADDRESS_MAX = 255;

/** 주문서 폼 검증 (서버 규칙: deliveryAddress 255자 · deliveryDong 50자 필수, 요청사항 200자) */
export const checkoutSchema = z
  .object({
    address: z.string().trim().min(1, '배달 주소를 입력해 주세요.'),
    addressDetail: z.string().trim(),
    deliveryDong: z.string().trim().min(1, '배달지 동을 입력해 주세요.').max(50, '동은 50자 이하로 입력해 주세요.'),
    storeRequest: z.string().trim().max(200, '가게 요청사항은 200자 이하로 입력해 주세요.'),
    riderRequest: z.string().trim().max(200, '라이더 요청사항은 200자 이하로 입력해 주세요.'),
  })
  .refine((values) => `${values.address} ${values.addressDetail}`.trim().length <= DELIVERY_ADDRESS_MAX, {
    message: '주소와 상세 주소를 합쳐 255자 이하로 입력해 주세요.',
    path: ['addressDetail'],
  });

/** 주문서 폼 값 */
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
