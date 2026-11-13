import type { ReactNode } from 'react';

import { formatDistance, type RiderLocation } from '@/entities/delivery';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

export interface CompleteConfirmModalProps {
  open: boolean;
  /** 라이더 위치 (남은 거리 안내용, 없으면 거리 없이 안내) */
  location: RiderLocation | null;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * GPS상 배달지에 도착하지 않았는데 배달 완료를 누르면 한 번 더 묻는 모달.
 * 막지는 않는다 — GPS 오차나 고객이 마중 나온 경우가 있어 라이더가 그래도 완료할 수 있다.
 * @param props open(열림), location(라이더 위치), onClose(닫기), onConfirm(그래도 완료)
 * @returns 미도착 완료 확인 모달 요소
 */
export function CompleteConfirmModal({ open, location, onClose, onConfirm }: CompleteConfirmModalProps): ReactNode {
  const remaining =
    location?.remainingDistanceM != null ? ` (약 ${formatDistance(location.remainingDistanceM)} 남음)` : '';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='아직 배달지 도착 전이에요'
      footer={
        <>
          <Button
            variant='secondary'
            size='lg'
            onClick={onClose}
          >
            계속 배달하기
          </Button>
          <Button
            size='lg'
            onClick={onConfirm}
          >
            그래도 완료
          </Button>
        </>
      }
    >
      <p className='text-fg-muted'>
        GPS상 배달지와 떨어져 있어요{remaining}. 고객에게 음식을 전달했다면 완료해 주세요.
      </p>
    </Modal>
  );
}
