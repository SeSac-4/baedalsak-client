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
