## 코드 컨벤션

- 컴포넌트: 함수 선언식(`function UserCard() {}`), PascalCase 명사
- 내부 함수: 함수 표현식(`const fn = () => {}`)
- `let` 지양, `const` 사용
- `.prettierrc` 확인 후 준수
- 함수 하나에 기능 하나, 필요하면 조합
- 모든 함수에 JSDoc 작성
- 타입 항상 명시

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
