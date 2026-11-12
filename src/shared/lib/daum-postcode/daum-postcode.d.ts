/**
 * 다음(카카오) 우편번호 서비스 타입 (쓰는 것만). 전체 항목: https://postcode.map.daum.net/guide
 * 스크립트는 load-daum-postcode.ts 가 불러와 window.daum 에 둔다.
 */
declare namespace daum {
  interface PostcodeData {
    /** 우편번호 (5자리) */
    zonecode: string;
    /** 기본 주소 (사용자가 고른 유형: 도로명 또는 지번) */
    address: string;
    roadAddress: string;
    jibunAddress: string;
    /** R(도로명) · J(지번) */
    userSelectedType: 'R' | 'J';
    /** 시·도 (예: 서울) */
    sido: string;
    /** 시·군·구 (예: 성동구) */
    sigungu: string;
    /** 법정동·법정리 (예: 성수동1가). 읍·면 지역은 리 이름 */
    bname: string;
    /** 법정 읍·면 (예: 봉담읍). 동 지역은 빈 값 */
    bname1: string;
    buildingName: string;
  }

  interface PostcodeOptions {
    oncomplete: (data: PostcodeData) => void;
    /** 창을 닫을 때. state: FORCE_CLOSE(사용자가 닫음) · COMPLETE_CLOSE(주소 선택 후 닫힘) */
    onclose?: (state: 'FORCE_CLOSE' | 'COMPLETE_CLOSE') => void;
    width?: string | number;
    height?: string | number;
  }

  class Postcode {
    constructor(options: PostcodeOptions);
    /** 팝업 창으로 연다 */
    open(options?: { q?: string; popupTitle?: string }): void;
    /** 지정한 요소 안에 넣는다 (모달 안 등) */
    embed(element: HTMLElement, options?: { q?: string; autoClose?: boolean }): void;
  }
}

interface Window {
  daum?: { Postcode: typeof daum.Postcode };
}
