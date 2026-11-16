import type { LatLngLiteral } from './geocode-address';
import { loadKakaoMap } from './load-kakao-map';

/** 좌표가 속한 동네 */
export interface Region {
  /** 동 이름 (예: 성수1가1동) */
  dong: string;
  /** 전체 지역명 (예: 서울특별시 성동구 성수1가1동) */
  address: string;
}

/**
 * 좌표를 동네(행정동)로 바꾼다 (카카오 좌표 → 행정구역). 행정동이 없으면 법정동을 쓴다.
 * @param position - 좌표
 * @returns 동네 (국외 등으로 못 찾으면 null)
 */
export const getRegion = async (position: LatLngLiteral): Promise<Region | null> => {
  const maps = await loadKakaoMap();
  return new Promise((resolve, reject) => {
    new maps.services.Geocoder().coord2RegionCode(position.lng, position.lat, (result, status) => {
      if (status === maps.services.Status.ZERO_RESULT) {
        resolve(null);
        return;
      }
      const region = result.find((item) => item.region_type === 'H') ?? result[0];
      if (status !== maps.services.Status.OK || !region) {
        reject(new Error('현재 위치의 동네를 찾지 못했어요.'));
        return;
      }
      resolve({ dong: region.region_3depth_name || region.region_2depth_name, address: region.address_name });
    });
  });
};
