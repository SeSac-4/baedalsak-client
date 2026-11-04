/** 화면에서만 쓰는 비밀번호 확인 값 */
interface PasswordConfirmField {
  passwordConfirm: string;
}

/**
 * 가입 폼 값에서 비밀번호 확인을 빼고 서버로 보낼 본문을 만든다 (서버 가입 API는 이 값을 받지 않는다).
 * @param values - 가입 폼 값
 * @returns 비밀번호 확인을 뺀 요청 본문
 */
export const parseSignupBody = <T extends PasswordConfirmField>(values: T): Omit<T, 'passwordConfirm'> => {
  const body: Omit<T, 'passwordConfirm'> & Partial<PasswordConfirmField> = { ...values };
  delete body.passwordConfirm;
  return body;
};
