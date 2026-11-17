import { useState, type ReactNode } from 'react';

import { ADDRESS_LIMIT_MESSAGE, MAX_ADDRESS_COUNT, useAddressList } from '@/entities/address';
import { getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Icon } from '@/shared/ui/icon';
import { Notice } from '@/shared/ui/notice';
import { Spinner } from '@/shared/ui/spinner';

import { MyAddressForm } from './my-address-form';
import { MyAddressItem } from './my-address-item';

/** 열려 있는 폼: 추가 · 수정할 주소 ID · 닫힘 */
type EditingTarget = 'new' | number | null;

/**
 * 내 정보(C-06) 배달 주소 카드 (고객만). 저장된 주소 목록과 [주소 추가]를 보여 주고, 추가 · 수정 폼은 한 번에 하나만 연다.
 * 3개를 채우면 [주소 추가]를 막고 안내한다. 헤더 위치 버튼 · 가게 목록 · 주문서가 이 주소들을 쓴다.
 * @returns 배달 주소 카드
 */
export function MyAddressCard(): ReactNode {
  const { data: addresses, error, isPending } = useAddressList();
  const [editing, setEditing] = useState<EditingTarget>(null);
  const count = addresses?.length ?? 0;
  const isFull = count >= MAX_ADDRESS_COUNT;
  const isEditing = editing !== null;

  /** 폼을 닫는다 */
  const handleClose = (): void => setEditing(null);

  return (
    <Card
      role='region'
      aria-labelledby='me-addresses'
    >
      <div className='mb-1 flex items-center gap-2'>
        <h2
          id='me-addresses'
          className='flex-1 font-bold'
        >
          배달 주소
        </h2>
        <span className='text-note text-fg-muted tabular-nums'>
          {count}/{MAX_ADDRESS_COUNT}
        </span>
      </div>
      <p className='mb-2 text-note text-fg-muted'>기본 주소 기준으로 주변 가게를 보여 드리고, 주문서에 미리 채워요.</p>

      {isPending ? (
        <div className='flex items-center gap-2 py-4 text-note text-fg-muted'>
          <Spinner size={16} />
          주소를 불러오고 있어요.
        </div>
      ) : error ? (
        <Notice tone='warn'>{getErrorMessage(error)}</Notice>
      ) : (
        <>
          {count > 0 ? (
            <ul className='flex flex-col'>
              {addresses?.map((address) =>
                editing === address.id ? (
                  <li
                    key={address.id}
                    className='py-3'
                  >
                    <MyAddressForm
                      address={address}
                      onClose={handleClose}
                    />
                  </li>
                ) : (
                  <MyAddressItem
                    key={address.id}
                    address={address}
                    onEditClick={() => setEditing(address.id)}
                    disabled={isEditing}
                  />
                ),
              )}
            </ul>
          ) : (
            <p className='py-3 text-note text-fg-muted'>아직 저장한 주소가 없어요.</p>
          )}

          {editing === 'new' ? (
            <MyAddressForm onClose={handleClose} />
          ) : (
            <div className='mt-1 flex flex-col gap-2'>
              <Button
                variant='outline'
                block
                disabled={isFull || isEditing}
                onClick={() => setEditing('new')}
              >
                <Icon
                  name='plus'
                  size={16}
                />
                주소 추가
              </Button>
              {isFull ? <p className='text-center text-note text-fg-muted'>{ADDRESS_LIMIT_MESSAGE}</p> : null}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
