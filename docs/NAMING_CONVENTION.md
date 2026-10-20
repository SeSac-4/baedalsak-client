## 파일·폴더 네이밍

- 폴더·파일 모두 kebab-case
- 파일명: `<도메인>-<역할>` (예: `not-found/ui/not-found-page.tsx`)
- 역할 접미사: page · form · card · modal · store · schema · api · query · types
- 훅은 `use-` 접두사 (`use-cart.ts` → `useCart`)
- 컴포넌트는 `.tsx`, 그 외는 `.ts`
- 파일 하나에 컴포넌트 하나, 이름은 파일명의 PascalCase (`not-found-page.tsx` → `NotFoundPage`)
- 슬라이스 외부 노출은 `index.ts`만

## 함수 네이밍

형식: `동사 + 명사` (camelCase)

| 동사           | 용도                            | HTTP       | 예시                            |
| -------------- | ------------------------------- | ---------- | ------------------------------- |
| get            | 값 조회/계산 (동기·비동기 공통) | GET        | `getUserList`                   |
| create         | 새 데이터 생성                  | POST       | `createOrder`                   |
| update         | 기존 데이터 수정                | PATCH, PUT | `updateProfile`                 |
| remove         | 데이터 삭제                     | DELETE     | `removeCartItem`                |
| set            | 상태/값 설정                    | -          | `setFilterOption`               |
| handle         | 이벤트 핸들러                   | -          | `handleSubmitClick`             |
| is / has / can | 불리언 반환                     | -          | `isValidEmail`, `hasPermission` |
| format         | 표시용 변환                     | -          | `formatDate`                    |
| parse          | 데이터 구조 변환                | -          | `parseResponse`                 |
| validate       | 유효성 검사                     | -          | `validateForm`                  |
| reset          | 초기값 복원                     | -          | `resetForm`                     |

- 표에 없는 동사는 이 표에 먼저 추가한 뒤 사용
- 예외: 컴포넌트는 PascalCase 명사 (`UserCard`), 훅은 `use` + 명사 (`useCart`)
