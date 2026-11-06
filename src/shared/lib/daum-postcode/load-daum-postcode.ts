import { loadScript } from '../load-script';

/** 다음 우편번호 서비스 스크립트 (키 필요 없음) */
const DAUM_POSTCODE_SDK_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

/** 우편번호 검색으로 고른 주소 */
export type PostcodeAddress = daum.PostcodeData;

/**
 * 다음 우편번호 서비스 스크립트를 불러온다. 여러 번 불러도 한 번만 불러온다.
 * @returns Postcode 생성자
 */
export const loadDaumPostcode = async (): Promise<typeof daum.Postcode> => {
  await loadScript(DAUM_POSTCODE_SDK_URL);
  const Postcode = window.daum?.Postcode;
  if (!Postcode) throw new Error('우편번호 서비스를 찾지 못했어요.');
  return Postcode;
};

/**
 * 주소 검색 팝업을 열고 사용자가 고른 주소를 돌려준다. 좌표가 필요하면 결과의 address 를
 * `@/shared/lib/kakao-map` 의 geocodeAddress 로 바꾼다.
 * @param query - 처음에 넣어 둘 검색어 (선택)
 * @returns 고른 주소 (고르지 않고 닫으면 null)
 * @example
 * const picked = await openAddressSearch();
 * if (picked) setValue('address', picked.address);
 */
export const openAddressSearch = async (query?: string): Promise<PostcodeAddress | null> => {
  const Postcode = await loadDaumPostcode();

  return new Promise((resolve) => {
    new Postcode({
      oncomplete: (data) => resolve(data),
      onclose: (state) => {
        if (state === 'FORCE_CLOSE') resolve(null);
      },
    }).open({ q: query });
  });
};
