import { useId, useState, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

/** 결제 서비스 필수 약관. 토스 결제위젯 약관 UI와 같은 항목과 원문 주소 (위젯의 항목별 보기 링크) */
const AGREEMENT_ITEMS: readonly { label: string; url: string }[] = [
  { label: '서비스 이용약관', url: 'https://pages.tosspayments.com/terms/user' },
  {
    label: '개인(신용)정보 수집 및 이용 동의',
    url: 'https://pages.tosspayments.com/terms/v2/tables/291/records/1174337',
  },
  {
    label: '개인(신용)정보 제3자 제공 동의',
    url: 'https://pages.tosspayments.com/terms/v2/tables/291/records/1174339',
  },
];

const CHECKBOX_CLASS = 'size-[18px] flex-none accent-role-ink';

export interface PaymentAgreementProps {
  /** 필수 약관에 모두 동의했는지 바뀔 때 */
  onAgreedChange: (isAgreed: boolean) => void;
}

/**
 * 결제 서비스 약관 동의. 토스 결제위젯 약관 UI처럼 전체 동의 한 줄을 펼치면 항목 3개가 보이고, 모두 동의해야 결제할 수 있다.
 * 항목마다 토스 약관 원문을 새 창으로 여는 보기 링크가 있다.
 * 처음에는 동의하지 않은 상태로 시작해 구매자가 직접 체크한다. 토스 결제창(구버전)에는 약관 동의 화면이 없어 우리 화면이 그린다.
 * @param props onAgreedChange(전체 동의 여부 변경)
 * @returns 약관 동의 요소
 */
export function PaymentAgreement({ onAgreedChange }: PaymentAgreementProps): ReactNode {
  const listId = useId();
  const [checked, setChecked] = useState<readonly boolean[]>(AGREEMENT_ITEMS.map((): boolean => false));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAllChecked = checked.every(Boolean);

  /**
   * 항목 동의를 바꾸고 전체 동의 여부를 알린다.
   * @param next 바뀐 항목별 동의
   */
  const setAgreements = (next: readonly boolean[]): void => {
    setChecked(next);
    onAgreedChange(next.every(Boolean));
  };

  /**
   * 항목 하나의 동의를 바꾼다.
   * @param index 항목 순서
   * @param value 동의 여부
   */
  const handleItemChange = (index: number, value: boolean): void => {
    setAgreements(checked.map((item, i): boolean => (i === index ? value : item)));
  };

  return (
    <div className='flex flex-col gap-2 border-t border-border pt-3 text-note'>
      <div className='flex items-center gap-2'>
        <label className='flex min-w-0 flex-1 items-center gap-2 text-fg'>
          <input
            type='checkbox'
            checked={isAllChecked}
            onChange={(event): void => setAgreements(AGREEMENT_ITEMS.map((): boolean => event.target.checked))}
            className={CHECKBOX_CLASS}
          />
          [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
        </label>
        <button
          type='button'
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-label={isOpen ? '약관 항목 접기' : '약관 항목 펼치기'}
          onClick={(): void => setIsOpen(!isOpen)}
          className='flex-none px-1 text-fg-muted'
        >
          <span
            aria-hidden
            className={cn('inline-block transition', isOpen ? 'rotate-90' : '')}
          >
            ›
          </span>
        </button>
      </div>
      <ul
        id={listId}
        hidden={!isOpen}
        className='flex flex-col gap-1.5 pl-6'
      >
        {AGREEMENT_ITEMS.map(({ label, url }, index): ReactNode => (
          <li
            key={label}
            className='flex items-center gap-2'
          >
            <label className='flex min-w-0 flex-1 items-center gap-2 text-fg-muted'>
              <input
                type='checkbox'
                checked={checked[index]}
                onChange={(event): void => handleItemChange(index, event.target.checked)}
                className={CHECKBOX_CLASS}
              />
              {label}
            </label>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`${label} 보기 (새 창)`}
              className='flex-none px-1 text-fg-muted'
            >
              <span aria-hidden>›</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
