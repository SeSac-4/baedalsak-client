## 기술 스택

- React 19 + TypeScript 6 + Vite 8 (Rolldown, React Compiler)
- 스타일: Tailwind CSS 4, clsx·tailwind-merge·cva
- 라우팅: React Router 7 (선언형 `<Routes>`)
- 서버 상태: TanStack Query 5 / 클라이언트 상태: Zustand 5
- 폼: React Hook Form 7 + Zod 4
- HTTP: axios
- 아키텍처: FSD, steiger로 검증
- Node 22 LTS, npm
- React Compiler 사용 → `useMemo`·`useCallback` 수동 최적화 지양

## FSD 아키텍처

- 레이어(위 → 아래): app · pages · widgets · features · entities · shared
- 위 레이어만 아래 레이어 import, 같은 레이어 슬라이스끼리 import 금지
- app·shared는 슬라이스 없이 세그먼트로 바로 구성
- 세그먼트: ui / model / api / lib / config (shared는 constants·types 추가)
- `owner`·`customer` 등 그룹 폴더에 코드 직접 두지 않음
- 다른 슬라이스는 `@/` + `index.ts`(public API)로만 참조
- 같은 슬라이스 내부는 상대 경로로 import
- features·widgets 슬라이스는 2곳 이상에서 쓸 때만 만든다. 1곳에서만 쓰면 그 페이지 안에 두고, 두 번째 사용처가 생기면 옮긴다. 사용처가 화면 흐름으로 확정됐으면 미리 둘 수 있다 (ADR-0001)
- 새 페이지: `ui/<slice>-page.tsx` 작성 → `index.ts` export → `app-router.tsx` 등록
