import { loadKakaoMap } from './load-kakao-map';

/** 위도·경도 */
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

/**
 * 주소 한 개를 카카오 주소 검색으로 찾는다.
 * @param maps - 초기화된 kakao.maps
 * @param address - 찾을 주소
 * @returns 첫 번째 결과 좌표 (결과 없으면 null)
 */
const searchAddress = (maps: typeof kakao.maps, address: string): Promise<LatLngLiteral | null> =>
  new Promise((resolve, reject) => {
    new maps.services.Geocoder().addressSearch(address, (result, status) => {
      if (status === maps.services.Status.OK && result[0]) {
        resolve({ lat: Number(result[0].y), lng: Number(result[0].x) });
        return;
      }
      if (status === maps.services.Status.ZERO_RESULT) {
        resolve(null);
        return;
      }
      reject(new Error(`주소를 좌표로 바꾸지 못했어요: ${address}`));
    });
  });

/**
 * 주소를 좌표로 바꾼다. 상세 주소(쉼표 뒤 동·호수) 때문에 못 찾으면 쉼표 앞만으로 다시 찾는다.
 * @param address - 주소 (예: 서울 성동구 성수이로 77, 302호)
 * @returns 좌표 (끝내 못 찾으면 null)
 */
export const geocodeAddress = async (address: string): Promise<LatLngLiteral | null> => {
  const maps = await loadKakaoMap();
  const found = await searchAddress(maps, address);
  if (found) return found;

  const baseAddress = address.split(',')[0]?.trim();
  return baseAddress && baseAddress !== address ? searchAddress(maps, baseAddress) : null;
};
