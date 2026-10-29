import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { useMyStore } from '@/entities/store';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { Card } from '@/shared/ui/card';
import { KeyValueList } from '@/shared/ui/key-value-list';
import { Spinner } from '@/shared/ui/spinner';

const STORE_NOT_FOUND = 'STORE_NOT_FOUND';
const STORE_CREATE_PATH = '/owner/store/new';
const STORE_MANAGE_PATH = '/owner/store';
const LINK_CLASS = 'font-medium text-role underline-offset-2 hover:underline';

/**
 * 사장님 내 가게 요약. 가게가 없으면(404 STORE_NOT_FOUND) 가게 등록 링크를 보여 준다.
 * @returns 가게 요약 카드 요소
 */
export function OwnerStoreCard(): ReactNode {
  const { data: store, error, isPending } = useMyStore();

  /**
   * 조회 상태에 맞는 카드 내용을 고른다.
   * @returns 카드 내용
   */
  const getContent = (): ReactNode => {
    if (isPending) return <Spinner label='가게 정보 확인 중' />;
    if (getErrorCode(error) === STORE_NOT_FOUND) {
      return (
        <p className='text-fg-muted'>
          아직 등록한 가게가 없어요.{' '}
          <Link
            to={STORE_CREATE_PATH}
            className={LINK_CLASS}
          >
            가게 등록
          </Link>
        </p>
      );
    }
    if (!store) return <p className='text-fg-muted'>{getErrorMessage(error)}</p>;
    return (
      <>
        <KeyValueList
          items={[
            { label: '가게 이름', value: store.name },
            { label: '주소', value: store.address },
          ]}
        />
        <Link
          to={STORE_MANAGE_PATH}
          className={`${LINK_CLASS} text-note`}
        >
          가게 관리
        </Link>
      </>
    );
  };

  return (
    <Card className='flex flex-col gap-3'>
      <h3 className='font-bold text-fg'>내 가게</h3>
      {getContent()}
    </Card>
  );
}
