import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { useMe } from '@/entities/session';
import { storeKeys } from '@/entities/store';
import { StoreForm, useCreateStore, type StoreFormValues } from '@/features/store/upsert-store';
import { getErrorCode } from '@/shared/api';
import { Notice } from '@/shared/ui/notice';
import { PageHeader } from '@/shared/ui/page-header';
import { useToast } from '@/shared/ui/toast';

const STORE_MANAGE_PATH = '/owner/store';
const STORE_ALREADY_EXISTS = 'STORE_ALREADY_EXISTS';
const CREATED_MESSAGE = '가게를 등록했어요.';

/**
 * O-00 가게 등록 화면. 가입 때 입력한 가게 이름을 기본값으로 채우고, 등록하면 가게 관리로 가서 영업시간 확인·운영 시작을 이어 한다.
 * 이미 가게가 있으면(409) 폼 아래에 안내하고 내 가게를 다시 받아 메뉴를 열어 준다.
 * @returns 가게 등록 페이지
 */
export function StoreCreatePage(): ReactNode {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { mutateAsync: createStore } = useCreateStore();

  /**
   * 가게를 등록한다. 실패하면 폼이 에러를 보여 주도록 다시 던진다.
   * @param values - 가게 정보
   */
  const handleSubmit = async (values: StoreFormValues): Promise<void> => {
    try {
      await createStore({ ...values, imageKey: null });
      toast(CREATED_MESSAGE, 'success');
      navigate(STORE_MANAGE_PATH, { replace: true });
    } catch (error: unknown) {
      if (getErrorCode(error) === STORE_ALREADY_EXISTS)
        await queryClient.invalidateQueries({ queryKey: storeKeys.me() });
      throw error;
    }
  };

  return (
    <div className='mx-auto flex w-full max-w-[560px] flex-col gap-3 tablet:gap-3.5 desktop:mx-0 desktop:max-w-[640px] desktop:gap-4'>
      <PageHeader
        title='가게 등록'
        description='가게를 등록해야 메뉴를 올리고 주문을 받을 수 있어요. 사장님 한 분당 가게 1개를 운영할 수 있어요.'
      />
      <StoreForm
        variant='create'
        defaultValues={{ name: me?.storeNameAtSignup ?? '' }}
        submitLabel='가게 등록하기'
        onSubmit={handleSubmit}
        notice={
          <Notice icon='info'>
            <p className='font-semibold text-fg'>등록하면 이렇게 시작해요</p>
            <p>영업시간은 매일 09:00~22:00으로 만들어지고, 운영 상태는 임시 중지로 시작해요.</p>
            <p>가게 사진과 영업시간은 등록 후 가게 관리에서 바꿀 수 있어요.</p>
          </Notice>
        }
      />
    </div>
  );
}
