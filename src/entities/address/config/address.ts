/** 고객 한 명이 저장할 수 있는 배달 주소 수 (서버 MAX_ADDRESSES) */
export const MAX_ADDRESS_COUNT = 3;

/** 별칭 최대 글자 수 (서버 규칙) */
export const ADDRESS_LABEL_MAX_LENGTH = 20;

/** 상세 주소 최대 글자 수 (서버 규칙) */
export const ADDRESS_DETAIL_MAX_LENGTH = 50;

/** 3개를 채웠을 때 · 409 ADDRESS_LIMIT_EXCEEDED 문구 */
export const ADDRESS_LIMIT_MESSAGE = `주소는 ${MAX_ADDRESS_COUNT}개까지 등록할 수 있어요.`;

/** 고른 주소의 좌표를 못 구했을 때 (저장을 막는다) */
export const ADDRESS_GEOCODE_FAILED_MESSAGE = '주소 위치를 찾지 못했어요. 다른 주소로 검색해 주세요.';
