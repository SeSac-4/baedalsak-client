import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Icon, type IconName } from '@/shared/ui/icon';

export interface PromoBannerProps {
  /** 지금 영업 중인 가게 수 */
  openCount: number;
  /** 가장 낮은 배달비 (가게가 없으면 null) */
  minDeliveryFee: number | null;
}

interface Slide {
  tag: string;
  title: string;
  description: string;
  /** 슬라이드 배경·글자색 */
  toneClass: string;
  /** 태그 글자색 */
  inkClass: string;
  /** 보조 문구 색 */
  subClass: string;
  icon?: IconName;
  cta?: { label: string; to: string };
}

const SLIDE_CONTROL_CLASS =
  'flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

/**
 * 지금 상황에 맞는 배너 목록을 만든다.
 * @param openCount - 영업 중인 가게 수
 * @param minDeliveryFee - 가장 낮은 배달비
 * @returns 배너 목록
 */
const getSlides = (openCount: number, minDeliveryFee: number | null): Slide[] => [
  {
    tag: '우리 동네',
    title: '우리 동네 음식,\n싹 모아 배달.',
    description: `지금 영업 중인 가게 ${openCount}곳${minDeliveryFee === null ? '' : ` · 배달비 ${formatPrice(minDeliveryFee)}부터`}`,
    toneClass: 'bg-(--customer) text-(--customer-on)',
    inkClass: 'text-(--customer-ink)',
    subClass: 'opacity-85',
  },
  {
    tag: '주문 추적',
    title: '주문부터 도착까지\n한눈에 확인해요.',
    description: '조리·배차·픽업 시각과 배정된 라이더를 주문 상세에서 볼 수 있어요.',
    toneClass: 'bg-(--customer-ink) text-(--customer-on)',
    inkClass: 'text-(--customer-ink)',
    subClass: 'opacity-85',
    icon: 'location',
    cta: { label: '주문내역 보기', to: '/orders' },
  },
  {
    tag: '사장님 모집',
    title: '우리 가게도\n배달싹에서 시작해요.',
    description: '별도 심사 없이 가입하고 바로 가게를 등록할 수 있어요.',
    toneClass: 'bg-(--owner) text-(--owner-on)',
    inkClass: 'text-(--owner-ink)',
    subClass: 'opacity-80',
    icon: 'store',
  },
  {
    tag: '라이더 모집',
    title: '도보·자전거·오토바이\n모두 라이더가 될 수 있어요.',
    description: '가입 즉시 배차 대기 목록에서 요청을 수락해 보세요.',
    toneClass: 'bg-(--rider) text-(--rider-on)',
    inkClass: 'text-(--rider-ink)',
    subClass: 'opacity-85',
    icon: 'motorcycle',
  },
];

/**
 * 홈 배너 (태블릿·PC). 이전·다음 버튼과 점으로 넘긴다. 자동으로 넘어가지 않는다.
 * @param props openCount(영업 중인 가게 수), minDeliveryFee(가장 낮은 배달비)
 * @returns 배너 요소
 */
export function PromoBanner({ openCount, minDeliveryFee }: PromoBannerProps): ReactNode {
  const slides = getSlides(openCount, minDeliveryFee);
  const [index, setIndex] = useState<number>(0);
  const slide = slides[index];

  /**
   * 해당 순서의 배너로 넘긴다. 끝에서는 반대쪽으로 돌아간다.
   * @param next - 배너 순서
   */
  const handleSlideChange = (next: number): void => {
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <section
      aria-roledescription='carousel'
      aria-label='배달싹 소식'
      className={cn('relative hidden overflow-hidden rounded-[20px] tablet:block', slide.toneClass)}
    >
      <span
        aria-hidden
        className='absolute -top-20 -right-15 size-80 rounded-full bg-white/10'
      />
      <span
        aria-hidden
        className='absolute right-45 -bottom-32.5 size-55 rounded-full bg-white/10'
      />
      <div
        role='group'
        aria-roledescription='slide'
        aria-label={`${index + 1} / ${slides.length}, ${slide.title.replace('\n', ' ')}`}
        className='relative flex min-h-55 items-center gap-6 px-7 pt-6 pb-15 desktop:min-h-60 desktop:px-10 desktop:pt-9 desktop:pb-16'
      >
        <div className='flex min-w-0 flex-1 flex-col gap-2.5'>
          <span className={cn('self-start rounded-full bg-surface px-2.5 py-0.75 text-note font-bold', slide.inkClass)}>
            {slide.tag}
          </span>
          <p className='text-[26px] leading-[1.25] font-extrabold tracking-[-0.02em] whitespace-pre-line desktop:text-[32px]'>
            {slide.title}
          </p>
          <p className={slide.subClass}>{slide.description}</p>
          {slide.cta ? (
            <Link
              to={slide.cta.to}
              className={cn(
                'mt-1 inline-flex h-11 items-center gap-1.5 self-start rounded-control bg-surface px-4.5 font-bold',
                slide.inkClass,
              )}
            >
              {slide.cta.label} ›
            </Link>
          ) : null}
        </div>
        {slide.icon ? (
          <span
            aria-hidden
            className={cn(
              'mr-2.5 flex size-27.5 flex-none items-center justify-center rounded-full bg-surface desktop:mr-7.5 desktop:size-37.5',
              slide.inkClass,
            )}
          >
            <Icon
              name={slide.icon}
              size={56}
            />
          </span>
        ) : (
          <img
            src='/mascot.png'
            alt=''
            className='h-32.5 w-37.5 flex-none object-contain desktop:h-47.5 desktop:w-55'
          />
        )}
      </div>
      <div className='absolute inset-x-0 bottom-0 flex items-center gap-2 pr-5 pb-3.5 pl-5.5 desktop:pr-7 desktop:pb-4 desktop:pl-8.5'>
        <div className='flex flex-1 gap-0.5'>
          {slides.map((item, slideIndex) => (
            <button
              key={item.tag}
              type='button'
              aria-label={`${slideIndex + 1}번 배너`}
              aria-current={slideIndex === index}
              onClick={() => handleSlideChange(slideIndex)}
              className={cn('size-7', SLIDE_CONTROL_CLASS)}
            >
              <span
                className={cn(
                  'block h-2 rounded-full bg-current transition-[width]',
                  slideIndex === index ? 'w-5.5' : 'w-2 opacity-50',
                )}
              />
            </button>
          ))}
        </div>
        <span
          aria-live='polite'
          className='rounded-full bg-black/20 px-2.5 py-0.5 text-note font-semibold'
        >
          {index + 1} / {slides.length}
        </span>
        <button
          type='button'
          aria-label='이전 배너'
          onClick={() => handleSlideChange(index - 1)}
          className={cn('size-10 rounded-full bg-black/10', SLIDE_CONTROL_CLASS)}
        >
          <Icon
            name='chevron-left'
            size={18}
          />
        </button>
        <button
          type='button'
          aria-label='다음 배너'
          onClick={() => handleSlideChange(index + 1)}
          className={cn('size-10 rounded-full bg-black/10', SLIDE_CONTROL_CLASS)}
        >
          <Icon
            name='chevron-right'
            size={18}
          />
        </button>
      </div>
    </section>
  );
}
