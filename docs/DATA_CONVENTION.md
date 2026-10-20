## 데이터 페칭·상태 관리

- axios 인스턴스는 `shared/api` 하나, baseURL `VITE_API_BASE_URL`, 토큰·에러는 인터셉터에서 처리
- 도메인 API는 `entities/<도메인>/api`, 기능 전용 요청은 `features/<기능>/api`
- API 함수명은 동사 표 기준 (`getOrderList`, `createOrder`)
- 응답 타입은 TypeScript로 `model/<도메인>-types.ts`에 선언
- queryKey는 `api/<도메인>-query.ts`의 키 팩토리(`orderKeys`)로만 생성
- mutation 성공 시 키 팩토리로 invalidate
- 서버 데이터는 TanStack Query만, Zustand에 복사 금지
- Zustand는 UI·클라이언트 상태만, `model/<도메인>-store.ts`
- Zod는 폼 입력 검증에만, `model/<기능>-schema.ts`, 타입은 `z.infer`로 추출
