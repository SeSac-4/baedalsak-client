import { cn } from '@/shared/lib/cn';

/** CMP-09 Chips — 단일 선택 필터 칩. 선택 시 역할색 반전, aria-pressed로 상태 노출. */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-8 items-center whitespace-nowrap rounded-full border px-3 text-note font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-role/50',
        selected
          ? 'border-role bg-role text-white'
          : 'border-border bg-surface text-fg-muted hover:bg-surface-hover',
        className,
      )}
      {...props}
    />
  );
}
