import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { StoreForm, useCreateStore, type StoreFormValues } from '@/features/store/upsert-store';
import { getErrorCode, getErrorMessage } from '@/shared/api';
import { Card } from '@/shared/ui/card';
import { PageHeader } from '@/shared/ui/page-header';
import { useToast } from '@/shared/ui/toast';

const ORDER_BOARD_PATH = '/owner/orders';
const STORE_ALREADY_EXISTS = 'STORE_ALREADY_EXISTS';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const CREATED_MESSAGE = '가게를 등록했어요. 임시 중지 상태예요. 영업시간을 확인하고 운영을 시작하세요.';

/**
 * O-00 가게 등록 화면. 등록하면 주문 관리로 가고, 이미 가게가 있으면(409) 바로 주문 관리로 보낸다.
 * 가입 때 입력한 가게 이름 기본값은 회원 정보 API 연동 때 채운다.
 * @returns 가게 등록 페이지
 */
export function StoreCreatePage(): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const { mutateAsync: createStore } = useCreateStore();

  /**
   * 가게를 등록한다. 필드 검증 실패는 폼으로 넘기고, 그 밖의 에러는 토스트로 알린다.
   * @param values - 가게 정보
   */
  const handleSubmit = async (values: StoreFormValues): Promise<void> => {
    try {
      await createStore(values);
      toast(CREATED_MESSAGE);
      navigate(ORDER_BOARD_PATH, { replace: true });
    } catch (error: unknown) {
      const code = getErrorCode(error);
      if (code === VALIDATION_FAILED) throw error;
      toast(getErrorMessage(error));
      if (code === STORE_ALREADY_EXISTS) navigate(ORDER_BOARD_PATH, { replace: true });
    }
  };

  return (
    <div className='mx-auto flex max-w-[700px] flex-col gap-4 px-4 py-6'>
      <PageHeader title='새 가게 등록' />
      <Card>
        <StoreForm
          submitLabel='가게 등록'
          onSubmit={handleSubmit}
        />
      </Card>
      <p className='text-note text-fg-muted'>
        등록하면 임시 중지 상태로 시작해요. 영업시간(기본 09:00~22:00)을 확인하고 운영을 시작하세요.
      </p>
    </div>
  );
}
