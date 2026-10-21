# ADR-0002: shared·app 세그먼트 이름을 FSD 규칙에 맞출지

- 작성일: 2026-10-21
- 관련 문서: `docs/ARCHITECTURE.md` (세그먼트 규칙)

## 1. 배경

**현재 상태**

- ARCHITECTURE.md는 세그먼트를 `ui / model / api / lib / config`로 정하고, "shared는 constants·types 추가"라고 적혀 있다.
- 스캐폴드에 아래 세그먼트가 만들어져 있고, 세 폴더 모두 `.gitkeep`만 있다 (코드 0개).
  - `shared/constants`, `shared/types`, `app/providers`

**문제**

- steiger 권장 설정의 `fsd/segments-by-purpose` 규칙은 세그먼트 이름이 내용물의 종류가 아니라 용도를 나타내야 한다고 본다. 위 세 폴더가 오류로 잡힌다 (현재 FSD 오류 39건 중 3건).
- steiger가 금지하는 이름은 `constants`·`types`·`providers` 외에도 `utils`, `helpers`, `components`, `hooks`, `schemas`, `services` 등이 있다.
- 이 3건은 우리 문서(ARCHITECTURE.md)와 FSD 규칙이 정면으로 다른 경우라, 다른 오류처럼 기능을 구현한다고 사라지지 않는다.

**정하지 않으면 생기는 영향**

- 공통 상수·타입이 생길 때마다 이 폴더에 들어가 오류가 고정으로 남는다.
- CLAUDE.md의 "FSD 검증 통과" 규칙을 지킬 수 없다.
- 나중에 코드가 쌓인 뒤 이름을 바꾸면 import 경로를 모두 고쳐야 한다.

**제약 조건**

- 세 폴더 모두 비어 있어 지금 바꾸면 옮길 코드가 없다.
- 이미 쓰는 `shared/ui`, `shared/lib`, `shared/api`, `shared/config`와 각 슬라이스의 `model/<도메인>-types.ts` 규칙(DATA_CONVENTION.md)은 영향 없다.
- 현재 프론트 작업자 1명, MVP 일정.

## 2. 선택지

### A. 문서를 FSD 규칙에 맞추기

- 개요: 내용물 종류로 지은 세그먼트를 없애고, 용도 기준 세그먼트에 둔다.
- 핵심 변경점
  - `shared/constants` 삭제 → 공통 상수는 `shared/config`에 둔다 (예: `shared/config/route-path.ts`)
  - `shared/types` 삭제 → 공통 타입은 그 타입을 쓰는 세그먼트 옆에 둔다 (예: 공통 응답 봉투·페이지 타입은 `shared/api/api-types.ts`)
  - `app/providers` 삭제 → QueryClient·Toast 등 Provider 조립은 `app/app.tsx`에서 한다
  - ARCHITECTURE.md의 "(shared는 constants·types 추가)" 문구를 삭제하고 위 배치를 적는다

### B. 문서를 유지하고 규칙을 끄기

- 개요: 지금 문서와 폴더 구조를 그대로 두고, 세 폴더에 한해 steiger 규칙을 끈다.
- 핵심 변경점
  - `steiger.config.ts`에 `{ files: ['./src/shared/constants/**', './src/shared/types/**', './src/app/providers/**'], rules: { 'fsd/segments-by-purpose': 'off' } }` 추가
  - ARCHITECTURE.md에 "constants·types·providers는 segments-by-purpose 예외"라고 적는다

## 3. 비교

| 항목   | A. 문서를 FSD에 맞추기                               | B. 문서 유지 + 규칙 끄기                        |
| ------ | ---------------------------------------------------- | ----------------------------------------------- |
| 비용   | 빈 폴더 3개 삭제 + 문서 1줄 수정                     | 설정 1블록 + 문서 1줄 추가                      |
| 프론트 | 공통 코드를 용도별로 찾음 (`config`·`api`)           | 공통 코드를 종류별로 찾음 (`constants`·`types`) |
| DB     | 영향 없음                                            | 영향 없음                                       |
| 성능   | 영향 없음                                            | 영향 없음                                       |
| 확장   | 다른 금지 이름(`utils` 등)도 같은 원칙으로 판단 가능 | 새 예외가 생길 때마다 설정에 경로 추가          |
| 운영   | 규칙을 끄지 않아 FSD 검증 결과가 그대로 신뢰됨       | 꺼진 경로 안에서는 이름 규칙 위반을 잡지 못함   |

**A. 문서를 FSD에 맞추기**

- 얻는 것: 오류 3건이 사라지고, steiger 규칙과 문서가 일치한다. 지금은 옮길 코드가 없어 비용이 거의 없다.
- 잃는 것: "상수는 constants" 같은 익숙한 위치가 없어져, 공통 타입·상수를 어디에 둘지 매번 용도로 판단해야 한다.
- 실패 시나리오: 기준이 모호한 공통 타입(예: 여러 세그먼트가 같이 쓰는 타입)이 `shared/api`·`shared/lib` 등에 흩어진다.

**B. 문서를 유지하고 규칙 끄기**

- 얻는 것: 익숙한 폴더 구조를 그대로 쓰고, 문서 변경도 거의 없다.
- 잃는 것: FSD 권장 방식과 어긋난 구조를 계속 유지하고, 설정에 예외가 남는다.
- 실패 시나리오: `constants`·`types`가 잡동사니 폴더가 되어 도메인별로 있어야 할 상수·타입까지 shared로 모인다.

## 4. 제안

**A. 문서를 FSD 규칙에 맞추기**를 제안한다.
세 폴더 모두 비어 있어서 지금 바꾸면 옮길 코드가 하나도 없고, 공통 코드가 쌓인 뒤에 바꾸는 것보다 훨씬 싸다.
ADR-0001에서 규칙을 끄지 않고 FSD 권장 방식을 따르기로 한 방향과도 맞다.
흩어질 위험은 "공통 상수는 `shared/config`, API 공통 타입은 `shared/api`"처럼 문서에 위치를 정해 두면 줄일 수 있다.

## 5. 결정 기록

(팀 논의 후 작성)

## 6. 후속 작업

- [ ] 결정 기록 작성
- [ ] (A 채택 시) `shared/constants`, `shared/types`, `app/providers` 삭제
- [ ] (A 채택 시) ARCHITECTURE.md 세그먼트 규칙 수정 (공통 상수·타입 위치 명시)
- [ ] (B 채택 시) `steiger.config.ts`에 예외 경로 추가, ARCHITECTURE.md에 예외 명시
- [ ] `npm run lint:fsd`로 segments-by-purpose 오류 0건 확인
