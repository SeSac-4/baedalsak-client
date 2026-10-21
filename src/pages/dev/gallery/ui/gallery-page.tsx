import { useState, type ReactNode } from 'react';

import { CART_EMPTY_MOCK, CART_MIN_NOT_MET_MOCK, CART_MOCK } from '@/entities/cart';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import { EmptyState } from '@/shared/ui/empty-state';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { PageHeader } from '@/shared/ui/page-header';
import { Select } from '@/shared/ui/select';
import { Spinner } from '@/shared/ui/spinner';
import { Stepper } from '@/shared/ui/stepper';
import { Tabs } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';
import { ToastProvider, useToast } from '@/shared/ui/toast';
import { CartSummaryCard } from '@/widgets/cart-summary';

/** 개발용 컴포넌트 갤러리. shared/ui 프리미티브를 variant·state별로 전시한다. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className='rounded-xl border border-border bg-surface p-5'>
      <h3 className='mb-4 text-body font-bold text-fg'>
        <span className='text-fg-subtle'>{id}</span> {title}
      </h3>
      <div className='flex flex-wrap items-center gap-3'>{children}</div>
    </section>
  );
}

function ToastDemo() {
  const toast = useToast();
  return (
    <>
      <Button
        variant='secondary'
        onClick={() => toast('저장되었습니다')}
      >
        토스트 띄우기
      </Button>
      <Button
        variant='secondary'
        onClick={() => toast('이미 처리된 주문입니다')}
      >
        다른 메시지
      </Button>
    </>
  );
}

const ROLES = [
  { key: 'customer', label: '고객', color: '#2563eb' },
  { key: 'owner', label: '사장님', color: '#92623a' },
  { key: 'rider', label: '라이더', color: '#0d9488' },
];

const CATEGORIES = ['전체', '한식', '분식', '치킨', '중식', '피자'];

const ORDER_STEPS = [
  { label: '결제대기', time: '11:02' },
  { label: '결제완료', time: '11:03' },
  { label: '조리중', time: '11:05' },
  { label: '배달중' },
  { label: '배달완료' },
];

const TAB_ITEMS = [
  { value: 'new', label: '신규', count: 3 },
  { value: 'cooking', label: '진행 중' },
  { value: 'done', label: '완료' },
];

export function GalleryPage() {
  const [category, setCategory] = useState('전체');
  const [tab, setTab] = useState('new');
  const [modalOpen, setModalOpen] = useState(false);

  function setRole(color: string) {
    document.documentElement.style.setProperty('--rc', color);
  }

  return (
    <ToastProvider>
      <div className='mx-auto flex max-w-[900px] flex-col gap-5 px-4 py-8'>
        <PageHeader
          title='컴포넌트 갤러리'
          badge={<Badge tone='info'>dev</Badge>}
          actions={
            <div className='flex items-center gap-1.5'>
              <span className='text-note text-fg-subtle'>역할색</span>
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type='button'
                  onClick={() => setRole(r.color)}
                  aria-label={`${r.label} 역할색 적용`}
                  className='size-6 rounded-full border border-border focus-visible:ring-2 focus-visible:ring-role/50 focus-visible:outline-none'
                  style={{ backgroundColor: r.color }}
                />
              ))}
            </div>
          }
        />
        <p className='-mt-3 text-note text-fg-subtle'>
          라이트/다크는 OS 설정을 따릅니다. 위 점을 눌러 역할 강조색(--rc) 변경을 확인하세요.
        </p>

        <Section
          id='CMP-07'
          title='Button'
        >
          <Button>Primary</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='danger'>Danger</Button>
          <Button size='sm'>sm</Button>
          <Button size='lg'>lg</Button>
          <Button disabled>Disabled</Button>
          <div className='w-full'>
            <Button
              block
              size='lg'
            >
              Block (모바일 주 CTA)
            </Button>
          </div>
        </Section>

        <Section
          id='CMP-05'
          title='StatusBadge'
        >
          <Badge tone='ok'>조리중 / 판매중</Badge>
          <Badge tone='warn'>결제대기 / 배차대기</Badge>
          <Badge tone='info'>결제완료 / 배차완료</Badge>
          <Badge tone='muted'>배달완료 / 품절</Badge>
        </Section>

        <Section
          id='CMP-09'
          title='Chips (단일 선택 필터)'
        >
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              selected={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </Chip>
          ))}
        </Section>

        <Section
          id='CMP-08'
          title='FormField (input / select / textarea)'
        >
          <div className='grid w-full grid-cols-1 gap-3 tablet:grid-cols-2'>
            <Input placeholder='이메일' />
            <Input
              placeholder='오류 상태'
              aria-invalid
              defaultValue='bad@'
            />
            <Select defaultValue=''>
              <option
                value=''
                disabled
              >
                카테고리 선택
              </option>
              {CATEGORIES.slice(1).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
            <Input
              placeholder='읽기 전용'
              readOnly
              value='010-0000-0000'
            />
            <div className='tablet:col-span-2'>
              <Textarea placeholder='요청사항을 입력하세요' />
            </div>
          </div>
        </Section>

        <Section
          id='(tabs)'
          title='Tabs'
        >
          <div className='w-full'>
            <Tabs
              items={TAB_ITEMS}
              value={tab}
              onChange={setTab}
            />
            <p className='mt-3 text-note text-fg-muted'>선택: {tab}</p>
          </div>
        </Section>

        <Section
          id='CMP-06'
          title='StatusTimeline (주문 5단계)'
        >
          <div className='w-full'>
            <Stepper
              steps={ORDER_STEPS}
              current={2}
            />
          </div>
        </Section>

        <Section
          id='CMP-17'
          title='Modal / Dialog'
        >
          <Button
            variant='secondary'
            onClick={() => setModalOpen(true)}
          >
            모달 열기
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title='장바구니를 비울까요?'
            footer={
              <>
                <Button
                  variant='secondary'
                  onClick={() => setModalOpen(false)}
                >
                  취소
                </Button>
                <Button
                  variant='danger'
                  onClick={() => setModalOpen(false)}
                >
                  비우고 담기
                </Button>
              </>
            }
          >
            다른 가게 메뉴가 담겨 있습니다. 비우고 새로 담을까요?
          </Modal>
        </Section>

        <Section
          id='CMP-16'
          title='Toast'
        >
          <ToastDemo />
        </Section>

        <Section
          id='CMP-15'
          title='EmptyState'
        >
          <div className='w-full'>
            <EmptyState
              message='아직 주문이 없습니다'
              action={<Button size='sm'>가게 둘러보기</Button>}
            />
          </div>
        </Section>

        <Section
          id='CMP-12'
          title='CartPanel (주문 가능 · 최소주문 미달 · 비어 있음)'
        >
          <div className='grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start gap-3'>
            <CartSummaryCard cart={CART_MOCK} />
            <CartSummaryCard cart={CART_MIN_NOT_MET_MOCK} />
            <CartSummaryCard cart={CART_EMPTY_MOCK} />
          </div>
        </Section>

        <Section
          id='(spinner)'
          title='Spinner'
        >
          <Spinner />
          <Spinner size={32} />
        </Section>
      </div>
    </ToastProvider>
  );
}
