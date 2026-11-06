/**
 * 카카오맵 JavaScript SDK 타입 (쓰는 것만). 전체 API: https://apis.map.kakao.com/web/documentation/
 * SDK 는 load-kakao-map.ts 가 불러와 window.kakao 에 둔다.
 */
declare namespace kakao.maps {
  function load(callback: () => void): void;

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class LatLngBounds {
    constructor();
    extend(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    /** 확대 수준 (작을수록 확대, 1~14) */
    level?: number;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    setBounds(
      bounds: LatLngBounds,
      paddingTop?: number,
      paddingRight?: number,
      paddingBottom?: number,
      paddingLeft?: number,
    ): void;
    relayout(): void;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: HTMLElement | string;
    map?: Map;
    /** 0~1. 0.5 면 가운데 */
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
  }

  namespace services {
    enum Status {
      OK = 'OK',
      ZERO_RESULT = 'ZERO_RESULT',
      ERROR = 'ERROR',
    }

    interface AddressSearchResult {
      address_name: string;
      /** 경도 (문자열) */
      x: string;
      /** 위도 (문자열) */
      y: string;
    }

    class Geocoder {
      constructor();
      addressSearch(address: string, callback: (result: AddressSearchResult[], status: Status) => void): void;
    }
  }
}

interface Window {
  kakao?: typeof kakao;
}
