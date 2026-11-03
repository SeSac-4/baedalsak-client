import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { Card } from '@/shared/ui/card';

export interface AuthLayoutProps {
  /** 카드 제목 (예: 로그인) */
  title: string;
  /** 카드 안 폼 */
  children: ReactNode;
  /** 카드 아래 전환 링크 (로그인 ↔ 회원가입) */
  footer?: ReactNode;
  /** 로고 이미지 표시 (로그인 화면만) */
  showLogo?: boolean;
  /** 제목 위 뒤로 가기 링크 (가입 화면 → 역할 선택) */
  back?: { to: string; label: string };
}

/**
 * CMP-21 AuthLayout — 로그인·회원가입 공용 틀. 가운데 로고·슬로건 아래 폼 카드(최대 420px)와 전환 링크를 둔다.
 * 로그인 전 화면이라 역할 강조색은 기본(고객 초록)을 쓴다.
 * @param props title(카드 제목), children(폼), footer(전환 링크), showLogo(로고 이미지), back(뒤로 가기 링크)
 * @returns 인증 화면 레이아웃 요소
 */
export function AuthLayout({ title, children, footer, showLogo = false, back }: AuthLayoutProps): ReactNode {
  return (
    <main className='flex min-h-dvh w-full flex-col items-center px-4 pt-8 pb-10'>
      <div className='flex w-full max-w-[420px] flex-col gap-5'>
        <header className='flex flex-col items-center gap-1'>
          {showLogo ? (
            <img
              src='/logo.png'
              alt=''
              className='mb-1 h-26 w-30 object-contain'
            />
          ) : null}
          <p className='text-[1.625rem] leading-[1.2] font-extrabold tracking-[-0.02em] text-role'>배달싹</p>
          <p className='text-fg-muted'>우리 동네 음식, 싹 모아 배달.</p>
        </header>
        <Card className='flex flex-col gap-4'>
          <div>
            {back ? (
              <Link
                to={back.to}
                className='-mt-2.5 inline-flex min-h-11 items-center rounded-control text-note text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
              >
                ‹ {back.label}
              </Link>
            ) : null}
            <h1 className='text-title font-bold'>{title}</h1>
          </div>
          {children}
        </Card>
        {footer ? (
          <div className='flex flex-wrap items-center justify-center gap-1.5 text-fg-muted'>{footer}</div>
        ) : null}
      </div>
    </main>
  );
}
