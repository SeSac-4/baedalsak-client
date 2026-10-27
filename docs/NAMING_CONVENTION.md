## 파일·폴더 네이밍

- 폴더·파일 모두 kebab-case
- 파일명: `<도메인>-<역할>` (예: `not-found/ui/not-found-page.tsx`)
- 역할 접미사: page · form · card · modal · store · schema · api · query · types · mock
- 훅은 `use-` 접두사 (`use-cart.ts` → `useCart`)
- 컴포넌트는 `.tsx`, 그 외는 `.ts`
- 파일 하나에 컴포넌트 하나, 이름은 파일명의 PascalCase (`not-found-page.tsx` → `NotFoundPage`)
- 슬라이스 외부 노출은 `index.ts`만
- 예외: `shared/ui`는 컴포넌트별 폴더에 컴포넌트명 그대로 (`shared/ui/button/button.tsx`)

## 함수 네이밍

형식: `동사 + 명사` (camelCase)

| 동사                       | 용도                            | HTTP       | 예시                              |
| -------------------------- | ------------------------------- | ---------- | --------------------------------- |
| get                        | 값 조회/계산 (동기·비동기 공통) | GET        | `getUserList`                     |
| create                     | 새 데이터 생성                  | POST       | `createOrder`                     |
| update                     | 기존 데이터 수정                | PATCH, PUT | `updateProfile`                   |
| remove                     | 데이터 삭제                     | DELETE     | `removeCartItem`                  |
| set                        | 상태/값 설정                    | -          | `setFilterOption`                 |
| handle                     | 이벤트 핸들러                   | -          | `handleSubmitClick`               |
| is / has / can             | 불리언 반환                     | -          | `isValidEmail`, `hasPermission`   |
| format                     | 표시용 변환                     | -          | `formatDate`                      |
| parse                      | 데이터 구조 변환                | -          | `parseResponse`                   |
| validate                   | 유효성 검사                     | -          | `validateForm`                    |
| reset                      | 초기값 복원                     | -          | `resetForm`                       |
| add                        | 목록에 항목 추가                | -          | `addToCart`                       |
| clear                      | 목록 전체 비우기                | -          | `clearCart`                       |
| toggle                     | 두 상태 전환                    | -          | `toggleSaleStatus`                |
| upsert                     | 생성·수정 겸용                  | -          | `upsertMenu`                      |
| accept / pickup / complete | 주문·배달 상태 전이             | -          | `acceptOrder`, `completeDelivery` |
| request                    | 외부 서비스에 처리 요청         | -          | `requestPayment`                  |
| confirm                    | 외부 서비스 처리 결과 확정      | -          | `confirmPayment`                  |

- 표에 없는 동사는 이 표에 먼저 추가한 뒤 사용
- feature 슬라이스명도 표의 동사 사용 (`remove-cart-item`)
- 예외: 컴포넌트는 PascalCase 명사 (`UserCard`), 훅은 `use` + 명사 (`useCart`)
