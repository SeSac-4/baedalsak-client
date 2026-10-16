import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx로 조건부 클래스를 합치고 tailwind-merge로 충돌(예: px-2 vs px-4)을 정리한다. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
