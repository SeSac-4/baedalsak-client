export type { SignupRequest, SignupResponse } from './api/signup-api';
export { SIGNUP_EMAIL_REQUIRED_MESSAGE } from './config/email-verification';
export { getSignupDonePath } from './lib/get-signup-done-path';
export { parseSignupError, type SignupFieldError } from './lib/parse-signup-error';
export {
  signupCommonSchema,
  signupCustomerSchema,
  signupOwnerSchema,
  signupRiderSchema,
  VEHICLE_TYPES,
  type SignupCommonValues,
  type SignupOwnerValues,
  type SignupRiderInput,
  type SignupRiderValues,
} from './model/signup-schema';
export { useSignup } from './model/use-signup';
export type { SignupCodeVerification } from './model/use-signup-code-verification';
export { useSignupEmailVerification } from './model/use-signup-email-verification';
export { useSignupPhoneVerification } from './model/use-signup-phone-verification';
export { SignupCommonFields, type SignupCommonFieldsProps } from './ui/signup-common-fields';
export { SignupLoginLink } from './ui/signup-login-link';
export { SignupSubmitButton, type SignupSubmitButtonProps } from './ui/signup-submit-button';
