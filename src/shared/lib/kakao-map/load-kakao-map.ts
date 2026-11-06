import { loadScript } from '../load-script';

/** 카카오맵 JavaScript 키 (브라우저용, 도메인 제한으로 보호) */
const KAKAO_MAP_KEY: string = import.meta.env.VITE_KAKAO_MAP_KEY ?? '';

/** 지도 + 주소 검색(services). autoload=false 로 불러오고 kakao.maps.load 로 초기화한다 */
const KAKAO_MAP_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;

/**
 * 카카오맵 SDK 를 불러와 초기화한다. 여러 번 불러도 한 번만 불러온다.
 * @returns 초기화된 kakao.maps 네임스페이스
 */
export const loadKakaoMap = async (): Promise<typeof kakao.maps> => {
  if (!KAKAO_MAP_KEY) throw new Error('VITE_KAKAO_MAP_KEY 가 없어요. .env 를 확인해 주세요.');

  await loadScript(KAKAO_MAP_SDK_URL);
  const sdk = window.kakao;
  if (!sdk) throw new Error('카카오맵 SDK 를 찾지 못했어요.');

  await new Promise<void>((resolve) => sdk.maps.load(resolve));
  return sdk.maps;
};
