import { z } from 'zod';

import { CATEGORY_CODES } from '@/entities/category';
const AMOUNT_MESSAGE = '0원 이상 숫자로 입력해 주세요.';

/** 가게 등록·수정 폼 검증 (서버 규칙: name 1~100자, address 1~255자, 금액 0 이상) */
export const storeSchema = z.object({
  name: z.string().trim().min(1, '가게 이름을 입력해 주세요.').max(100, '가게 이름은 100자 이하로 입력해 주세요.'),
  category: z.enum(CATEGORY_CODES, { error: '카테고리를 골라 주세요.' }),
  address: z.string().trim().min(1, '주소를 입력해 주세요.').max(255, '주소는 255자 이하로 입력해 주세요.'),
  minOrderAmount: z.number({ error: AMOUNT_MESSAGE }).int(AMOUNT_MESSAGE).min(0, AMOUNT_MESSAGE),
  deliveryFee: z.number({ error: AMOUNT_MESSAGE }).int(AMOUNT_MESSAGE).min(0, AMOUNT_MESSAGE),
});

/** 가게 등록·수정 폼 값 */
export type StoreFormValues = z.infer<typeof storeSchema>;
