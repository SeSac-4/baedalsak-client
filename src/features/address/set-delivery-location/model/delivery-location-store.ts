import { create } from 'zustand';

interface DeliveryLocationState {
  /** 헤더에서 [현재 위치로 보기]를 골랐으면 true. 서버에 저장하지 않아 새로고침하면 기본 주소로 돌아간다 */
  prefersCurrent: boolean;
  setPrefersCurrent: (prefersCurrent: boolean) => void;
}

/**
 * 가게 목록 기준 위치 선택 (UI 상태). 헤더 위치 버튼과 가게 목록이 같은 값을 본다.
 * @returns 위치 선택 스토어 훅
 */
export const useDeliveryLocationStore = create<DeliveryLocationState>()((set) => ({
  prefersCurrent: false,
  setPrefersCurrent: (prefersCurrent: boolean): void => set({ prefersCurrent }),
}));
