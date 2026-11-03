import { useState, type ReactNode } from 'react';

import type { Cart } from '@/entities/cart';
import { DeliveryCard, type RiderDelivery, type WaitingDelivery } from '@/entities/delivery';
import { useDocumentRole } from '@/shared/lib/use-document-role';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ChoiceButton, ChoiceGroup } from '@/shared/ui/choice';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { Icon } from '@/shared/ui/icon';
import { IconButton } from '@/shared/ui/icon-button';
import { Input } from '@/shared/ui/input';
import { KeyValueList } from '@/shared/ui/key-value-list';
import { Modal } from '@/shared/ui/modal';
import { NavPills } from '@/shared/ui/nav-pills';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { PasswordInput } from '@/shared/ui/password-input';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { QtyStepper } from '@/shared/ui/qty-stepper';
import { Select } from '@/shared/ui/select';
import { Spinner } from '@/shared/ui/spinner';
import { StatusPill } from '@/shared/ui/status-pill';
import { Stepper } from '@/shared/ui/stepper';
import { Switch } from '@/shared/ui/switch';
import { Tabs } from '@/shared/ui/tabs';
import { Textarea } from '@/shared/ui/textarea';
import { Thumbnail } from '@/shared/ui/thumbnail';
import { ToastProvider } from '@/shared/ui/toast';
import { CartSummaryCard } from '@/widgets/cart-summary';

import { GallerySection } from './gallery-section';
import { GalleryToastDemo } from './gallery-toast-demo';

/** 갤러리 전시용 예시 값 (서버 데이터 아님, 이 개발용 화면에서만 사용) */
const SAMPLE_CART: Cart = {
  storeId: 1,
  storeName: '예시 분식',
  items: [
    { menuId: 1, menuName: '참치김밥', price: 4500, quantity: 2 },
    { menuId: 2, menuName: '라볶이', price: 6000, quantity: 1 },
  ],
  itemsAmount: 15000,
  deliveryFee: 3000,
  totalAmount: 18000,
  minOrderAmount: 12000,
  canOrder: true,
  cannotOrderReason: null,
};

const SAMPLE_CART_MIN_NOT_MET: Cart = {
  ...SAMPLE_CART,
  items: [{ menuId: 1, menuName: '참치김밥', price: 4500, quantity: 1 }],
  itemsAmount: 4500,
  totalAmount: 7500,
  canOrder: false,
  cannotOrderReason: 'MIN_ORDER_AMOUNT_NOT_MET',
};

const SAMPLE_CART_EMPTY: Cart = {
  storeId: null,
  storeName: null,
  items: [],
  itemsAmount: 0,
  deliveryFee: 0,
  totalAmount: 0,
  minOrderAmount: 0,
  canOrder: false,
  cannotOrderReason: 'CART_EMPTY',
};

const SAMPLE_WAITING_DELIVERY: WaitingDelivery = {
  deliveryId: 1,
  storeName: '예시 분식',
  pickupAddress: '서울 예시구 예시로 1',
  deliveryDong: '예시동',
  deliveryFee: 3000,
  estimatedReadyAt: '2026-10-13T12:30:00+09:00',
  createdAt: '2026-10-13T12:10:00+09:00',
};

const SAMPLE_RIDER_DELIVERY: RiderDelivery = {
  deliveryId: 2,
  orderId: 1,
  status: 'ASSIGNED',
  storeName: '예시 분식',
  pickupAddress: '서울 예시구 예시로 1',
  deliveryAddress: '서울 예시구 예시로 2, 101호',
  customerPhone: '010-0000-0000',
  riderRequest: '문 앞에 두고 벨 눌러 주세요',
  deliveryFee: 3000,
  estimatedReadyAt: '2026-10-13T12:30:00+09:00',
  assignedAt: '2026-10-13T12:15:00+09:00',
  pickedUpAt: null,
};

type GalleryRole = 'CUSTOMER' | 'OWNER' | 'RIDER';

const ROLE_OPTIONS: { value: GalleryRole; label: string }[] = [
  { value: 'CUSTOMER', label: '고객' },
  { value: 'OWNER', label: '사장님' },
  { value: 'RIDER', label: '라이더' },
];

const CATEGORIES = ['한식', '분식', '치킨', '중식', '피자', '카페·디저트'];

const COOK_MINUTES = [10, 15, 20, 30, 45, 60];

const ORDER_STEPS = [
  { label: '결제대기', time: '12:01' },
  { label: '결제완료', time: '12:02' },
  { label: '조리중', time: '12:06' },
  { label: '배달중', time: '12:33' },
  { label: '배달완료' },
];

const TAB_ITEMS = [
  { value: 'new', label: '신규', count: 2, isEmphasized: true },
  { value: 'active', label: '진행 중', count: 1 },
  { value: 'done', label: '완료', count: 3 },
];

const NAV_ITEMS = [
  { to: '/gallery', label: '홈', end: true },
  { to: '/orders', label: '주문내역' },
  { to: '/payments', label: '결제내역' },
  { to: '/me', label: '내 정보' },
];

const OWNER_NAV_ITEMS = [
  { to: '/gallery', label: '주문 관리', count: 2 },
  { to: '/owner/menus', label: '메뉴 관리' },
  { to: '/owner/store', label: '가게 관리' },
  { to: '/me', label: '내 정보' },
];

const MIN_ORDER_AMOUNT = 12000;

/**
 * 개발용 컴포넌트 갤러리 (/gallery). shared/ui 컴포넌트를 variant·상태별로 늘어놓고, 역할색을 바꿔 확인한다.
 * @returns 갤러리 페이지
 */
export function GalleryPage(): ReactNode {
  const [role, setRole] = useState<GalleryRole>('CUSTOMER');
  const [category, setCategory] = useState<string>('분식');
  const [minutes, setMinutes] = useState<number>(20);
  const [tab, setTab] = useState<string>('new');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isOnSale, setIsOnSale] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsAmount = 9000 * quantity;
  useDocumentRole(role);

  return (
    <ToastProvider>
      <div className='min-h-dvh bg-canvas'>
        <div className='mx-auto flex max-w-[960px] flex-col gap-4 px-4 py-8'>
          <PageHeader
            title='컴포넌트 갤러리'
            badge={<Badge tone='info'>dev</Badge>}
            description='라이트·다크는 OS 설정을 따라요. 역할을 바꾸면 강조색이 바뀌어요.'
            actions={
              <ChoiceGroup
                aria-label='역할색'
                className='w-60'
              >
                {ROLE_OPTIONS.map((option) => (
                  <ChoiceButton
                    key={option.value}
                    selected={role === option.value}
                    onClick={() => setRole(option.value)}
                    className='min-h-9 text-note'
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </ChoiceGroup>
            }
          />

          <GallerySection
            name='Button'
            title='primary · secondary · outline · ghost · danger · danger-secondary / sm 36 · md 44 · lg 48'
          >
            <Button>주문하기</Button>
            <Button variant='secondary'>상세</Button>
            <Button variant='outline'>담기</Button>
            <Button variant='ghost'>전체 비우기</Button>
            <Button variant='danger'>삭제</Button>
            <Button variant='danger-secondary'>삭제</Button>
            <Button size='sm'>sm</Button>
            <Button size='lg'>lg</Button>
            <Button disabled>최소주문금액을 채워 주세요</Button>
            <Button
              variant='outline'
              disabled
            >
              담기
            </Button>
            <Button
              block
              size='lg'
            >
              21,000원 결제하기
            </Button>
          </GallerySection>

          <GallerySection
            name='IconButton · Icon'
            title='secondary · ghost / md 44 · sm 36'
          >
            <IconButton
              icon='refresh'
              label='새로고침'
            />
            <IconButton
              icon='close'
              label='닫기'
              variant='ghost'
            />
            <IconButton
              icon='plus'
              label='추가'
              size='sm'
            />
            <IconButton
              icon='refresh'
              label='새로고침'
              disabled
            />
            <span className='flex gap-2 text-fg-muted'>
              <Icon name='location' />
              <Icon name='bag' />
              <Icon name='clock' />
              <Icon name='receipt' />
              <Icon name='camera' />
              <Icon name='external' />
              <Icon name='chevron-right' />
            </span>
          </GallerySection>

          <GallerySection
            name='Badge'
            title='ok · warn · info · muted · role'
          >
            <Badge tone='warn'>결제대기</Badge>
            <Badge tone='info'>결제완료</Badge>
            <Badge tone='ok'>조리중</Badge>
            <Badge tone='info'>배달중</Badge>
            <Badge tone='muted'>배달완료</Badge>
            <Badge tone='ok'>판매 중</Badge>
            <Badge tone='muted'>품절</Badge>
            <Badge tone='role'>5개</Badge>
          </GallerySection>

          <GallerySection
            name='StatusPill · NavPills'
            title='헤더 상태 표시 · 역할별 주요 메뉴 (가로 · 세로)'
          >
            <StatusPill dot='ok'>성수 떡볶이 · 정상 운영</StatusPill>
            <StatusPill dot='warn'>성수 떡볶이 · 임시 중지</StatusPill>
            <StatusPill icon='location'>성수이로 77</StatusPill>
            <div className='w-full'>
              <NavPills
                label='고객 메뉴 예시'
                items={NAV_ITEMS}
              />
            </div>
            <div className='w-50'>
              <NavPills
                label='사장님 메뉴 예시'
                orientation='vertical'
                items={OWNER_NAV_ITEMS}
              />
            </div>
          </GallerySection>

          <GallerySection
            name='Input · PasswordInput · Select · Textarea'
            title='46px · 단위 · 비밀번호 보기 · 오류 · 읽기 전용 · 비활성'
          >
            <div className='grid w-full grid-cols-1 gap-3 tablet:grid-cols-2'>
              <Input placeholder='이메일' />
              <PasswordInput placeholder='비밀번호' />
              <Input
                aria-invalid
                defaultValue='gildong@example'
              />
              <Input
                inputMode='numeric'
                defaultValue='12,000'
                suffix='원'
                className='text-right'
              />
              <Input
                readOnly
                value='010-0000-0000'
              />
              <Input
                disabled
                value='비활성'
              />
              <Select defaultValue=''>
                <option
                  value=''
                  disabled
                >
                  카테고리 선택
                </option>
                {CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Textarea
                placeholder='메뉴 설명'
                className='tablet:col-span-2'
              />
            </div>
          </GallerySection>

          <GallerySection
            name='ChoiceGroup · ChoiceButton'
            title='카테고리 · 조리 예상 시간 (하나 고르기)'
          >
            <ChoiceGroup
              aria-label='카테고리'
              className='w-full'
            >
              {CATEGORIES.map((item) => (
                <ChoiceButton
                  key={item}
                  selected={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </ChoiceButton>
              ))}
            </ChoiceGroup>
            <ChoiceGroup
              aria-label='조리 예상 시간'
              className='w-full max-w-[340px]'
            >
              {COOK_MINUTES.map((item) => (
                <ChoiceButton
                  key={item}
                  selected={minutes === item}
                  onClick={() => setMinutes(item)}
                >
                  {item}분
                </ChoiceButton>
              ))}
            </ChoiceGroup>
          </GallerySection>

          <GallerySection
            name='Switch · Tabs'
            title='운영·판매 상태 · 세그먼트 탭'
          >
            <Card className='flex w-full items-center gap-3 py-3'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 font-bold'>
                  운영 상태 <Badge tone={isOpen ? 'ok' : 'warn'}>{isOpen ? '정상 운영' : '임시 중지'}</Badge>
                </div>
                <p className='text-note text-fg-muted'>
                  {isOpen ? '영업시간 안이면 주문을 받아요' : '고객이 주문할 수 없어요'}
                </p>
              </div>
              <Switch
                checked={isOpen}
                onCheckedChange={setIsOpen}
                label='정상 운영'
              />
            </Card>
            <Switch
              checked={isOnSale}
              onCheckedChange={setIsOnSale}
              label='판매 중'
            />
            <Switch
              checked
              disabled
              onCheckedChange={setIsOnSale}
              label='비활성'
            />
            <Tabs
              items={TAB_ITEMS}
              value={tab}
              onChange={setTab}
              label='주문 상태'
              className='w-full'
            />
          </GallerySection>

          <GallerySection
            name='Stepper · QtyStepper · ProgressBar'
            title='주문 단계 · 수량 · 최소주문금액'
          >
            <Card className='w-full px-2.5 py-4'>
              <Stepper
                steps={ORDER_STEPS}
                current={3}
              />
            </Card>
            <QtyStepper
              value={quantity}
              label='로제 떡볶이'
              onDecrease={() => setQuantity((prev) => prev - 1)}
              onIncrease={() => setQuantity((prev) => prev + 1)}
            />
            <div className='flex w-full flex-col gap-1.5'>
              <div className='flex justify-between text-note'>
                <span className={itemsAmount < MIN_ORDER_AMOUNT ? 'text-warn' : 'text-role-ink'}>
                  {itemsAmount < MIN_ORDER_AMOUNT ? '최소주문금액까지 조금 남았어요' : '최소주문금액을 채웠어요'}
                </span>
                <span className='text-fg-muted'>최소주문 12,000원</span>
              </div>
              <ProgressBar
                value={itemsAmount}
                max={MIN_ORDER_AMOUNT}
                label='최소주문금액 채움'
                tone={itemsAmount < MIN_ORDER_AMOUNT ? 'warn' : 'role'}
              />
            </div>
          </GallerySection>

          <GallerySection
            name='Notice · KeyValueList'
            title='안내 상자 (warn · muted · role) · 라벨·값 (plain · boxed)'
          >
            <div className='flex w-full flex-col gap-2'>
              <Notice tone='warn'>지금은 영업시간이 아니에요. 21:00에 영업을 시작해요.</Notice>
              <Notice>수락하면 바로 조리중이 되고 배달 요청이 자동으로 만들어져요. 조리 완료 예상 12:46</Notice>
              <Notice tone='role'>등록 후 메뉴를 추가하면 고객 화면에 가게가 보여요.</Notice>
            </div>
            <KeyValueList
              size='note'
              items={[
                { label: '배달 주소', value: '서울 성동구 성수이로 77, 302호' },
                { label: '가게 요청', value: '단무지 빼 주세요' },
              ]}
              className='w-full max-w-[320px]'
            />
            <KeyValueList
              variant='boxed'
              labelWidth={56}
              items={[
                { label: '가게', value: '덜 맵게 해 주세요' },
                { label: '라이더', value: '문 앞에 두고 벨 눌러 주세요' },
              ]}
              className='w-full max-w-[320px]'
            />
          </GallerySection>

          <GallerySection
            name='Card'
            title='md · sm · none(사진) · interactive · highlighted'
          >
            <div className='grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-3'>
              <Card>기본 카드 (20px)</Card>
              <Card padding='sm'>목록 카드 (16×20px)</Card>
              <Card padding='none'>
                <Thumbnail
                  src={null}
                  alt='가게'
                  placeholderLabel='가게 대표 사진 · 16:9'
                  className='aspect-video w-full rounded-none'
                />
                <p className='p-4 font-bold'>사진 카드</p>
              </Card>
              <Card interactive>누를 수 있는 카드</Card>
              <Card highlighted>진행 중 주문</Card>
            </div>
          </GallerySection>

          <GallerySection
            name='Thumbnail'
            title='사진 · 사진 없음(문구) · 불러오기 실패'
          >
            <Thumbnail
              src='/favicon.svg'
              alt='예시 사진'
              className='size-20'
            />
            <Thumbnail
              src={null}
              alt='메뉴'
              placeholderLabel='메뉴 사진'
              className='size-20'
            />
            <Thumbnail
              src='/images/not-found.jpg'
              alt='불러오기 실패'
              className='size-20'
            />
            <Thumbnail
              src={null}
              alt='작은 썸네일'
              className='size-10'
            />
          </GallerySection>

          <GallerySection
            name='Modal · Toast'
            title='가운데 모달 · 하단 토스트'
          >
            <Button
              variant='secondary'
              onClick={() => setIsModalOpen(true)}
            >
              모달 열기
            </Button>
            <GalleryToastDemo />
            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title='주문 #1045 수락'
              description='로제 떡볶이 1 · 순대 1 · 20,000원'
              footer={<Button size='lg'>{minutes}분으로 수락</Button>}
            >
              <ChoiceGroup aria-label='조리 예상 시간'>
                {COOK_MINUTES.map((item) => (
                  <ChoiceButton
                    key={item}
                    selected={minutes === item}
                    onClick={() => setMinutes(item)}
                  >
                    {item}분
                  </ChoiceButton>
                ))}
              </ChoiceGroup>
              <Notice>수락하면 바로 조리중이 되고 배달 요청이 자동으로 만들어져요.</Notice>
            </Modal>
          </GallerySection>

          <GallerySection
            name='EmptyState · Spinner · DataTable'
            title='빈 목록 · 불러오는 중 · 표'
          >
            <EmptyState
              icon='receipt'
              message='아직 주문한 적이 없어요'
              description='우리 동네 가게에서 첫 주문을 해 보세요.'
              action={<Button size='lg'>가게 둘러보기</Button>}
              className='w-full'
            />
            <Spinner />
            <Spinner size={32} />
            <DataTable wrapperClassName='w-full'>
              <thead>
                <tr>
                  <th>메뉴</th>
                  <th className='text-right'>가격</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>로제 떡볶이</td>
                  <td className='text-right'>12,000원</td>
                </tr>
                <tr>
                  <td>모둠 튀김</td>
                  <td className='text-right'>6,000원</td>
                </tr>
              </tbody>
            </DataTable>
          </GallerySection>

          <GallerySection
            name='CartSummaryCard · DeliveryCard'
            title='공용 컴포넌트를 쓰는 기존 위젯·엔티티 (화면 개편 전)'
          >
            <div className='grid w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start gap-3'>
              <CartSummaryCard cart={SAMPLE_CART} />
              <CartSummaryCard cart={SAMPLE_CART_MIN_NOT_MET} />
              <CartSummaryCard cart={SAMPLE_CART_EMPTY} />
            </div>
            <div className='grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] items-start gap-3'>
              <DeliveryCard
                delivery={SAMPLE_WAITING_DELIVERY}
                footer={<Button block>수락하기</Button>}
              />
              <DeliveryCard
                delivery={SAMPLE_RIDER_DELIVERY}
                footer={<Button block>픽업 완료</Button>}
              />
              <DeliveryCard
                delivery={{ ...SAMPLE_RIDER_DELIVERY, status: 'PICKED_UP', pickedUpAt: '2026-10-13T12:32:00+09:00' }}
                footer={<Button block>배달 완료</Button>}
              />
            </div>
          </GallerySection>
        </div>
      </div>
    </ToastProvider>
  );
}
