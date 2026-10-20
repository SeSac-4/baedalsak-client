import { cn } from '@/shared/lib/cn';

/** 로딩 스피너 (U-06 결제 승인 처리 등). role=status + aria-label로 상태를 알린다. */
export interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Spinner({ size = 20, className, label = '로딩 중' }: SpinnerProps) {
  return (
    <span
      role='status'
      aria-label={label}
      style={{ width: size, height: size }}
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-border border-t-role align-[-0.125em]',
        className,
      )}
    />
  );
}
