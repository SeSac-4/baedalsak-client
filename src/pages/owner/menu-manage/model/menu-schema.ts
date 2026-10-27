import { z } from 'zod';

const PRICE_MESSAGE = '1원 이상 숫자로 입력해 주세요.';

/** 메뉴 등록·수정 폼 검증 (서버 규칙: name 1~100자, description 500자 이하, price 0보다 큼) */
export const menuSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해 주세요.').max(100, '메뉴명은 100자 이하로 입력해 주세요.'),
  description: z.string().trim().max(500, '설명은 500자 이하로 입력해 주세요.'),
  price: z.number({ error: PRICE_MESSAGE }).int(PRICE_MESSAGE).positive(PRICE_MESSAGE),
});

/** 메뉴 등록·수정 폼 값 (설명은 빈 문자열이면 null로 보낸다) */
export type MenuFormValues = z.infer<typeof menuSchema>;
