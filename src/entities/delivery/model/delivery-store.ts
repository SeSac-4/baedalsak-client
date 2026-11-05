import { create } from 'zustand';

interface RiderOnlineState {
  /** 운행 중이면 true (배차 요청을 받음). 서버에 저장하지 않는 화면 상태 */
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;
}

/**
 * 라이더 운행 상태 (UI 상태). 헤더 표시와 배차 대기 목록 노출에 쓴다. 운행 상태 API가 없어 새로고침하면 운행 중으로 돌아간다.
 * @returns 운행 상태 스토어 훅
 */
export const useRiderOnlineStore = create<RiderOnlineState>()((set) => ({
  isOnline: true,
  setOnline: (isOnline: boolean): void => set({ isOnline }),
}));
