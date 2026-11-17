/** 저장된 배달 주소 (GET /members/me/addresses 한 줄) */
export interface DeliveryAddress {
  id: number;
  /** 별칭 (예: 집 · 회사). 없으면 null */
  label: string | null;
  /** 도로명 주소 */
  address: string;
  /** 상세 주소 (동·호수). 없으면 null */
  addressDetail: string | null;
  /** 배달지 동 (주문의 deliveryDong) */
  dong: string;
  lat: number;
  lng: number;
  /** 기본 주소 (항상 1개, 목록 맨 앞) */
  isDefault: boolean;
}

/** 우편번호 검색 + 좌표 변환 결과 (주소 저장에 꼭 필요한 값) */
export interface AddressLocation {
  /** 도로명 주소 */
  address: string;
  /** 배달지 동 */
  dong: string;
  lat: number;
  lng: number;
}

/** 주소 추가 · 수정 본문 (가입의 address 칸은 isDefault를 빼고 같은 모양) */
export interface AddressRequest extends AddressLocation {
  /** 별칭 (20자, 선택) */
  label?: string;
  /** 상세 주소 (50자, 선택) */
  addressDetail?: string;
  /** true면 이 주소를 기본 주소로. false는 서버가 무시한다 */
  isDefault?: boolean;
}
