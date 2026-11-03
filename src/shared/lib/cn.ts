import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 프로젝트 테마 토큰을 아는 tailwind-merge.
 * 글자 크기(text-note·body·title)를 알려 주지 않으면 글자색(text-fg 등)과 같은 것으로 보고 하나를 지운다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['note', 'body', 'title'],
      radius: ['control', 'card'],
    },
  },
});

/**
 * clsx로 조건부 클래스를 합치고 tailwind-merge로 충돌(예: px-2 vs px-4)을 정리한다.
 * @param inputs - 클래스 값들
 * @returns 합친 클래스 문자열
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
