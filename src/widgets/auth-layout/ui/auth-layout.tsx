import type { ReactNode } from 'react';

import { Card } from '@/shared/ui/card';

export interface AuthLayoutProps {
  /** 카드 제목 (예: 로그인) */
  title: string;
  /** 카드 안 폼 */
  children: ReactNode;
  /** 카드 아래 전환 링크 (로그인 ↔ 회원가입) */
  footer?: ReactNode;
}

/**
 * CMP-21 AuthLayout — 로그인·회원가입 공용 틀. 로고·슬로건 아래 폼 카드(최대 420px)와 전환 링크를 둔다.
 * @param props title(카드 제목), children(폼), footer(전환 링크)
 * @returns 인증 화면 레이아웃 요소
 */
export function AuthLayout({ title, children, footer }: AuthLayoutProps): ReactNode {
  return (
    <main className='mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center gap-5 px-4 py-10'>
      <header className='flex flex-col gap-1'>
        <h1 className='text-[1.625rem] font-bold text-role'>배달싹</h1>
        <p className='text-fg-muted'>우리 동네 음식, 싹 모아 배달.</p>
      </header>
      <Card className='flex flex-col gap-4 p-5'>
        <h2 className='text-body font-bold text-fg'>{title}</h2>
        {children}
      </Card>
      {footer ? <div className='flex flex-wrap items-center justify-center gap-1 text-note'>{footer}</div> : null}
    </main>
  );
}
