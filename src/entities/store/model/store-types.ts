import type { CategoryCode } from '@/entities/category/@x/store';

/** 가게 운영 상태: 정상 운영 / 임시 중지 */
export type OperationStatus = 'OPEN' | 'PAUSED';

/** 요일별 영업시간 한 행 */
export interface BusinessHour {
  /** 0=일 ~ 6=토 */
  dayOfWeek: number;
  /** 'HH:mm', 휴무면 null */
  openTime: string | null;
  /** 'HH:mm', 휴무면 null */
  closeTime: string | null;
  isClosed: boolean;
}

/** GET /stores 응답 항목 */
export interface StoreSummary {
  id: number;
  name: string;
  category: CategoryCode;
  minOrderAmount: number;
  deliveryFee: number;
  operationStatus: OperationStatus;
  /** 현재 영업 여부 (서버 계산 가정) */
  isOpenNow: boolean;
  todayHour: BusinessHour;
  /** 가게 사진 주소 (CloudFront, 사진 없으면 null) */
  imageUrl: string | null;
  /** 가게 사진 S3 키 (수정 요청에 그대로 다시 보낸다, 사진 없으면 null) */
  imageKey: string | null;
}

/** GET /stores/{storeId} · GET /stores/me 응답 */
export interface StoreDetail extends StoreSummary {
  address: string;
  /** 7행 (일~토) */
  businessHours: BusinessHour[];
}

/** GET /stores 응답 (커서 기반 무한 스크롤). 마지막 페이지면 nextCursor null · hasNext false */
export interface StorePage {
  content: StoreSummary[];
  /** 다음 요청의 cursor로 그대로 넘긴다 (해석하거나 계산하지 않는다) */
  nextCursor: string | null;
  hasNext: boolean;
}

/** GET /stores/summary 응답 (가게 목록 통계) */
export interface StoreListSummary {
  /** 전체 가게 수 */
  totalCount: number;
  /** 지금 영업 중인 가게 수 (목록의 isOpenNow와 같은 조건) */
  openCount: number;
  /** 가장 낮은 배달비 (가게가 없으면 null) */
  minDeliveryFee: number | null;
  /** 카테고리별 가게 수 (가게가 없는 카테고리도 0으로 모두 온다) */
  categoryCounts: Record<CategoryCode, number>;
}
