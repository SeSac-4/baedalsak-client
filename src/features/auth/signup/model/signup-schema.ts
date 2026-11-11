import { z } from 'zod';

import {
  emailSchema,
  passwordConfirmSchema,
  passwordSchema,
  phoneSchema,
  PASSWORD_MISMATCH_MESSAGE,
  type VehicleType,
} from '@/entities/session';

/** 라이더 운송수단 선택지 (화면 표시 순서) */
export const VEHICLE_TYPES = ['WALK', 'BICYCLE', 'MOTORCYCLE'] as const satisfies readonly VehicleType[];

/** 가입 공통 필드 검증. 비밀번호 확인은 화면에서만 쓰고 서버로 보내지 않는다 (서버 규칙: 이메일 255자 이하, 비밀번호 8~50자·영문 소문자·숫자 포함, 휴대폰 010 형식) */
export const signupCommonSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
  name: z.string().trim().min(1, '이름을 입력해 주세요.').max(50, '이름은 50자 이하로 입력해 주세요.'),
  phone: phoneSchema,
});

/**
 * 비밀번호와 비밀번호 확인이 같은지 본다. 다르면 확인 칸에 오류를 붙인다.
 * 공통 스키마에 바로 걸면 역할별 스키마가 extend할 수 없어(Zod 4) 역할별 스키마 끝에 건다.
 * @param values - 비밀번호·비밀번호 확인
 * @returns 일치 여부
 */
const isPasswordConfirmed = ({ password, passwordConfirm }: { password: string; passwordConfirm: string }): boolean =>
  password === passwordConfirm;

const PASSWORD_MISMATCH = { path: ['passwordConfirm'], message: PASSWORD_MISMATCH_MESSAGE };

/** 고객 가입 폼 검증 (공통 + 비밀번호 일치) */
export const signupCustomerSchema = signupCommonSchema.refine(isPasswordConfirmed, PASSWORD_MISMATCH);

/** 사장님 가입 폼 검증 (공통 + 가게 이름 1~100자 + 비밀번호 일치) */
export const signupOwnerSchema = signupCommonSchema
  .extend({
    storeName: z
      .string()
      .trim()
      .min(1, '가게 이름을 입력해 주세요.')
      .max(100, '가게 이름은 100자 이하로 입력해 주세요.'),
  })
  .refine(isPasswordConfirmed, PASSWORD_MISMATCH);

/** 라이더 가입 폼 검증 (공통 + 운송수단 + 비밀번호 일치). 선택 전 빈 값도 받도록 문자열로 받고 enum으로 좁힌다 */
export const signupRiderSchema = signupCommonSchema
  .extend({
    vehicleType: z.string().pipe(z.enum(VEHICLE_TYPES, { error: '운송수단을 골라 주세요.' })),
  })
  .refine(isPasswordConfirmed, PASSWORD_MISMATCH);

/** 가입 공통 필드 값 */
export type SignupCommonValues = z.infer<typeof signupCommonSchema>;

/** 사장님 가입 폼 값 */
export type SignupOwnerValues = z.infer<typeof signupOwnerSchema>;

/** 라이더 가입 폼 입력 값 (운송수단 선택 전 빈 문자열) */
export type SignupRiderInput = z.input<typeof signupRiderSchema>;

/** 라이더 가입 폼 검증 후 값 */
export type SignupRiderValues = z.output<typeof signupRiderSchema>;
