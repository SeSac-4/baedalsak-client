import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { MEMBER_ROLE_LABEL, type MemberRole } from '@/entities/session';
import { SignupLoginLink } from '@/features/auth/signup';
import { Icon, type IconName } from '@/shared/ui/icon';
import { AuthLayout } from '@/widgets/auth-layout';

interface SignupRoleOption {
  role: MemberRole;
  path: string;
  icon: IconName;
  description: string;
}

/** 가입 역할 카드 (화면 표시 순서) */
const SIGNUP_ROLE_OPTIONS: readonly SignupRoleOption[] = [
  { role: 'CUSTOMER', path: '/signup/customer', icon: 'bag', description: '우리 동네 가게에서 음식을 주문해요.' },
  { role: 'OWNER', path: '/signup/owner', icon: 'store', description: '가게를 등록하고 주문을 받아요.' },
  { role: 'RIDER', path: '/signup/rider', icon: 'motorcycle', description: '주문을 픽업해 고객에게 배달해요.' },
];

/**
 * C-02 회원가입 역할 선택 화면. 고객·사장님·라이더 카드 중 하나를 골라 역할별 가입 화면으로 간다.
 * 카드 왼쪽 아이콘 타일은 data-role로 그 역할의 강조색을 쓴다.
 * @returns 역할 선택 페이지
 */
export function SignupRolePage(): ReactNode {
  return (
    <AuthLayout
      title='회원가입'
      footer={<SignupLoginLink />}
    >
      <div className='flex flex-col gap-2.5'>
        <p className='text-fg-muted'>어떤 회원으로 가입할지 골라 주세요.</p>
        <ul className='flex flex-col gap-2.5'>
          {SIGNUP_ROLE_OPTIONS.map(({ role, path, icon, description }) => (
            <li key={role}>
              <Link
                to={path}
                className='flex min-h-11 items-center gap-3.5 rounded-control border border-border bg-surface px-4 py-3.5 text-fg transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink'
              >
                <span
                  data-role={role}
                  aria-hidden
                  className='flex size-10 shrink-0 items-center justify-center rounded-control bg-role-soft text-role-ink'
                >
                  <Icon
                    name={icon}
                    size={22}
                    strokeWidth={1.8}
                  />
                </span>
                <span className='flex flex-1 flex-col gap-0.5 leading-[1.4]'>
                  <span className='font-bold'>{MEMBER_ROLE_LABEL[role]}</span>
                  <span className='text-note text-fg-muted'>{description}</span>
                </span>
                <Icon
                  name='chevron-right'
                  size={18}
                  className='shrink-0 text-fg-subtle'
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}
