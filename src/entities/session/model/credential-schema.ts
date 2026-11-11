import { z } from 'zod';

/** 비밀번호 규칙 안내 (입력칸 아래 회색 문구) */
export const PASSWORD_HINT = '8~50자, 영문 소문자와 숫자를 함께 넣어 주세요.';

/** 비밀번호 확인 칸이 비밀번호와 다를 때 문구 */
export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않아요.';

const PASSWORD_MESSAGE = '비밀번호는 8~50자, 영문 소문자와 숫자를 1개 이상 넣어 주세요.';
const LOWERCASE_PATTERN = /[a-z]/;
const DIGIT_PATTERN = /\d/;

/** 이메일 검증 (서버 규칙: 이메일 형식·255자 이하). 로그인·가입·비밀번호 찾기 공용 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, '이메일을 입력해 주세요.')
  .max(255, '이메일은 255자 이하로 입력해 주세요.')
  .pipe(z.email('이메일 형식이 올바르지 않아요.'));

/** 새 비밀번호 검증 (서버 규칙: 8~50자·영문 소문자·숫자 포함). 가입·비밀번호 재설정 공용 */
export const passwordSchema = z
  .string()
  .min(8, PASSWORD_MESSAGE)
  .max(50, PASSWORD_MESSAGE)
  .regex(LOWERCASE_PATTERN, PASSWORD_MESSAGE)
  .regex(DIGIT_PATTERN, PASSWORD_MESSAGE);

/** 비밀번호 확인 칸 검증 (빈 값만 막고, 일치 여부는 각 폼 스키마의 refine에서 본다). 화면에서만 쓰고 서버로 보내지 않는다 */
export const passwordConfirmSchema = z.string().min(1, '비밀번호를 한 번 더 입력해 주세요.');
