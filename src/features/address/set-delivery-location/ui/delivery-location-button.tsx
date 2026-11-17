import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { formatAddressLine, formatAddressName, type DeliveryAddress } from '@/entities/address';
import { cn } from '@/shared/lib/cn';
import { isLocationDenied } from '@/shared/lib/geolocation';
import { Icon } from '@/shared/ui/icon';
import { useToast } from '@/shared/ui/toast';

import { useDeliveryLocationStore } from '../model/delivery-location-store';
import { useDeliveryLocation, type DeliveryLocation } from '../model/use-delivery-location';
import { useSetDefaultAddress } from '../model/use-set-default-address';

const ADDRESS_MANAGE_PATH = '/me';
const SET_DEFAULT_ERROR_MESSAGE = '주소를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.';

const TRIGGER_CLASS =
  'flex min-h-11 min-w-0 items-center gap-1 rounded-control px-2 text-body font-semibold text-fg transition hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-role-ink disabled:cursor-progress';
const MENU_ITEM_CLASS =
  'flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left text-body text-fg transition hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none';

/**
 * 버튼에 보일 위치 문구를 고른다. 기본 주소면 별칭(없으면 동), 현재 위치면 동네 이름이나 확인 상태.
 * @param location - 기준 위치
 * @returns 버튼 문구
 */
const getLocationText = ({ source, address, current }: DeliveryLocation): string => {
  if (source === 'pending') return '위치 확인 중…';
  if (source === 'address' && address) return formatAddressName(address);
  if (current.isPending) return '위치 확인 중…';
  if (isLocationDenied(current.error)) return '위치 권한 필요';
  if (current.error) return '위치 찾기 실패';
  return current.data?.region?.dong ?? '현재 위치';
};

/**
 * 버튼에 마우스를 올렸을 때 보일 전체 주소.
 * @param location - 기준 위치
 * @returns 전체 주소 (모르면 undefined)
 */
const getLocationTitle = ({ source, address, current }: DeliveryLocation): string | undefined =>
  source === 'address' && address ? formatAddressLine(address) : current.data?.region?.address;

/**
 * 헤더의 내 위치 버튼 (고객 레이아웃). 가게 목록이 이 위치 기준으로 반경 안 가게를 보여 준다.
 * 로그인한 고객이 주소를 저장했으면 기본 주소를 보여 주고, 누르면 내 주소 · [현재 위치로 보기] · [주소 관리] 목록을 연다.
 * 주소를 고르면 그 주소를 기본 주소로 지정한다(다른 기기에서도 같음). [현재 위치로 보기]는 새로고침 전까지만 기억한다.
 * 비로그인 · 주소 없음 · 사장님 · 라이더는 지금처럼 브라우저 위치를 보여 주고, 누르면 다시 확인한다.
 * @returns 내 위치 버튼 요소
 */
export function DeliveryLocationButton(): ReactNode {
  const location = useDeliveryLocation();
  const { source, address: selectedAddress, addresses, canChooseAddress, current } = location;
  const toast = useToast();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setPrefersCurrent = useDeliveryLocationStore((state) => state.setPrefersCurrent);
  const { mutate: setDefaultAddress, isPending: isSetting } = useSetDefaultAddress();
  const text = getLocationText(location);
  const title = getLocationTitle(location);

  useEffect(() => {
    if (!isOpen) return undefined;
    /**
     * 목록 밖을 누르면 닫는다.
     * @param event - 누른 이벤트
     */
    const handlePointerDown = (event: PointerEvent): void => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    /**
     * Esc를 누르면 닫는다.
     * @param event - 키보드 이벤트
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!canChooseAddress) {
    return (
      <button
        type='button'
        onClick={() => void current.refetch()}
        disabled={source === 'pending' || current.isFetching}
        title={title}
        aria-label={`내 위치: ${title ?? text}. 다시 확인`}
        className={TRIGGER_CLASS}
      >
        <Icon
          name='location'
          size={18}
          className='shrink-0 text-role'
        />
        <span className='truncate'>{text}</span>
      </button>
    );
  }

  /**
   * 주소를 고른다. 이미 기본 주소면 현재 위치 선택만 풀고, 아니면 기본 주소로 지정한다.
   * @param address - 고른 주소
   */
  const handleAddressClick = (address: DeliveryAddress): void => {
    setIsOpen(false);
    if (address.isDefault) {
      setPrefersCurrent(false);
      return;
    }
    setDefaultAddress(address, {
      onSuccess: () => setPrefersCurrent(false),
      onError: () => toast(SET_DEFAULT_ERROR_MESSAGE),
    });
  };

  /** 현재 위치로 본다. 이미 현재 위치면 다시 확인한다 */
  const handleCurrentClick = (): void => {
    setIsOpen(false);
    if (source === 'current') {
      void current.refetch();
      return;
    }
    setPrefersCurrent(true);
  };

  return (
    <div
      ref={containerRef}
      className='relative min-w-0'
    >
      <button
        type='button'
        onClick={() => setIsOpen((open) => !open)}
        disabled={isSetting}
        title={title}
        aria-haspopup='true'
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`배달 위치: ${title ?? text}. 바꾸기`}
        className={TRIGGER_CLASS}
      >
        <Icon
          name='location'
          size={18}
          className='shrink-0 text-role'
        />
        <span className='truncate'>{text}</span>
        <Icon
          name='chevron-down'
          size={16}
          className={cn('shrink-0 text-fg-muted transition', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? (
        <div
          id={menuId}
          className='fixed inset-x-4 top-14 z-30 mt-1 flex flex-col overflow-hidden rounded-card border border-border bg-surface py-1 shadow-[0_8px_24px_rgb(0_0_0/0.18)] tablet:absolute tablet:inset-x-auto tablet:top-full tablet:left-0 tablet:w-[300px]'
        >
          <p className='px-3 pt-1.5 pb-1 text-note font-semibold text-fg-muted'>배달 받을 위치</p>
          <ul>
            {addresses.map((address) => {
              const isSelected = source === 'address' && selectedAddress?.id === address.id;
              return (
                <li key={address.id}>
                  <button
                    type='button'
                    aria-current={isSelected}
                    onClick={() => handleAddressClick(address)}
                    className={MENU_ITEM_CLASS}
                  >
                    <span className='flex min-w-0 flex-1 flex-col leading-[1.4]'>
                      <span className={cn('truncate', isSelected && 'font-bold text-role-ink')}>
                        {formatAddressName(address)}
                      </span>
                      <span className='truncate text-note text-fg-muted'>{formatAddressLine(address)}</span>
                    </span>
                    {isSelected ? (
                      <Icon
                        name='check'
                        size={18}
                        className='shrink-0 text-role'
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className='mt-1 border-t border-border pt-1'>
            <button
              type='button'
              aria-current={source === 'current'}
              onClick={handleCurrentClick}
              className={MENU_ITEM_CLASS}
            >
              <Icon
                name='location'
                size={18}
                className='shrink-0 text-fg-muted'
              />
              <span className={cn('min-w-0 flex-1 truncate', source === 'current' && 'font-bold text-role-ink')}>
                현재 위치로 보기
              </span>
              {source === 'current' ? (
                <Icon
                  name='check'
                  size={18}
                  className='shrink-0 text-role'
                />
              ) : null}
            </button>
            <Link
              to={ADDRESS_MANAGE_PATH}
              onClick={() => setIsOpen(false)}
              className={MENU_ITEM_CLASS}
            >
              <Icon
                name='home'
                size={18}
                className='shrink-0 text-fg-muted'
              />
              <span className='min-w-0 flex-1'>주소 관리</span>
              <Icon
                name='chevron-right'
                size={16}
                className='shrink-0 text-fg-muted'
              />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
