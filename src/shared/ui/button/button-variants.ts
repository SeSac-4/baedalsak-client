import { cva, type VariantProps } from 'class-variance-authority';

/**
 * 버튼 스타일. variant: primary(역할색 채움) · secondary(회색 테두리) · outline(역할색 테두리) · ghost(배경 없음)
 * · danger(주황 채움, 되돌릴 수 없는 확정) · danger-secondary(회색 테두리 + 주황 글자, 삭제 진입).
 * size: sm 36px · md 44px(터치 최소) · lg 48px(화면 주 버튼).
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-control whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-not-allowed aria-disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-role font-bold text-role-on hover:brightness-105 disabled:bg-surface-hover disabled:text-fg-subtle aria-disabled:bg-surface-hover aria-disabled:text-fg-subtle',
        secondary:
          'border border-border bg-surface font-semibold text-fg hover:bg-surface-hover disabled:text-fg-disabled',
        outline:
          'border border-role bg-surface font-semibold text-role-ink hover:bg-role-soft disabled:border-border disabled:bg-surface-hover disabled:text-fg-subtle',
        ghost: 'font-semibold text-fg-muted hover:bg-surface-hover hover:text-fg disabled:text-fg-disabled',
        danger: 'bg-warn font-bold text-warn-on hover:brightness-105 disabled:bg-surface-hover disabled:text-fg-subtle',
        'danger-secondary':
          'border border-border bg-surface font-semibold text-warn hover:bg-warn-soft disabled:text-fg-disabled',
      },
      size: {
        sm: 'h-9 px-3 text-note',
        md: 'h-11 px-4 text-body',
        lg: 'h-12 px-5 text-body',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;

/**
 * 링크·label 등 버튼이 아닌 요소에 버튼 모양을 줄 때 쓰는 클래스.
 * @param options - variant·size·block
 * @returns 클래스 문자열
 */
export const getButtonClassName = (options: ButtonVariantProps = {}): string => buttonVariants(options);
