# ADR-0001: 페이지 하나에서만 쓰는 features 슬라이스를 어떻게 다룰지

- 작성일: 2026-10-20
- 관련 이슈: #9 (가게 화면 UI)

## 1. 배경

**현재 상태**

- 스캐폴드에 features 슬라이스 23개가 미리 만들어져 있다 (`features/store/toggle-operation-status` 등).
- #9 작업에서 O-04 가게 관리 화면의 UI를 이 스캐폴드에 맞춰 넣었다.
  - `features/store/upsert-store` → O-00·O-04에서 사용 (참조 2곳)
  - `features/store/toggle-operation-status` → O-04에서만 사용 (참조 1곳)
  - `features/store/update-business-hours` → O-04에서만 사용 (참조 1곳)

**문제**

- steiger 권장 설정의 `fsd/insignificant-slice` 규칙이 참조 1곳짜리 슬라이스에 "참조하는 곳과 합치라"는 경고를 낸다.
- 화면 흐름 시트 기준으로 보면 스캐폴드 features 대부분이 화면 1곳에서만 쓰인다.

| 슬라이스                              | 쓰는 화면             | 예상 참조 수     |
| ------------------------------------- | --------------------- | ---------------- |
| auth/login, logout, signup-\* (5개)   | C-01, C-06, C-03~05   | 각 1             |
| cart/add-to-cart                      | U-02                  | 1                |
| cart/clear·remove·update (3개)        | widgets/cart-summary  | 각 1             |
| delivery/accept·pickup·complete (3개) | R-01, R-02            | 각 1             |
| menu/delete·toggle-sale-status·upsert | O-05                  | 각 1             |
| order/accept-order, create-order      | O-01, U-04            | 각 1             |
| payment/confirm-payment               | U-06                  | 1                |
| payment/request-payment               | U-04, U-05            | 2                |
| store/filter-by-category              | U-01                  | 1                |
| store/toggle-operation-status         | O-01(상단 토글), O-04 | 2 (O-01 구현 후) |
| store/update-business-hours           | O-04                  | 1                |
| store/upsert-store                    | O-00, O-04            | 2                |

→ 23개 중 약 20개가 참조 1곳이라, 기능을 구현할수록 같은 경고가 늘어난다.

**정하지 않으면 생기는 영향**

- 슬라이스마다 "합칠지 둘지"를 사람마다 다르게 판단해서 구조가 섞인다.
- CLAUDE.md의 "FSD 검증 통과" 규칙을 지킬 수 없는 상태가 계속된다. (develop 기준으로도 이미 다른 오류 55건이 있어 검증이 실패하는 중)

**제약 조건**

- 프론트 MVP 2주 일정, 화면 25개.
- 아키텍처 문서(ARCHITECTURE.md)는 기능 단위를 features에 두는 것을 전제로 작성됨.
- steiger는 규칙 단위로 끄거나 파일 범위를 지정해 끌 수 있다.

## 2. 선택지

### A. 지금 구조 유지 + 경고 그대로 둠

- 개요: 스캐폴드대로 기능은 모두 features에 둔다. insignificant-slice 경고는 알고 있는 경고로 보고 넘어간다.
- 핵심 변경점: 코드·설정 변경 없음. 팀 안에서 "이 경고는 무시한다"고 합의만 한다.

### B. 구조 유지 + insignificant-slice 규칙 끄기

- 개요: 스캐폴드대로 features에 두고, `steiger.config.ts`에서 features 레이어에 한해 `fsd/insignificant-slice`를 끈다.
- 핵심 변경점: `steiger.config.ts`에 `{ files: ['./src/features/**'], rules: { 'fsd/insignificant-slice': 'off' } }` 추가.

### C. 참조 1곳이면 페이지 안으로 합치고, 2곳 이상이면 features로 올림

- 개요: FSD 공식 권장 방식. 한 화면에서만 쓰는 기능은 `pages/<slice>/ui·model·api`에 두고, 두 번째 사용처가 생길 때 features로 옮긴다.
- 핵심 변경점: 스캐폴드의 단일 참조 features 슬라이스 약 20개를 삭제하고 각 페이지 안으로 옮긴다. ARCHITECTURE.md에 승격 규칙을 추가한다.

## 3. 비교

| 항목   | A. 유지 + 경고 둠          | B. 유지 + 규칙 끄기                        | C. 페이지로 합치기                             |
| ------ | -------------------------- | ------------------------------------------ | ---------------------------------------------- |
| 비용   | 없음                       | 설정 1줄                                   | 스캐폴드 정리 + 문서 수정, 작업 중인 코드 이동 |
| 프론트 | 구조 일관, 경고가 늘어남   | 구조 일관, 경고 없음                       | 파일이 쓰는 곳 가까이 모임, 페이지 폴더가 커짐 |
| DB     | 영향 없음                  | 영향 없음                                  | 영향 없음                                      |
| 성능   | 영향 없음                  | 영향 없음                                  | 영향 없음 (번들 결과 동일)                     |
| 확장   | 재사용 시 바로 import 가능 | 재사용 시 바로 import 가능                 | 재사용 시 features로 옮기는 작업 필요          |
| 운영   | 진짜 문제 경고가 묻힘      | 규칙 하나만 꺼서 나머지 검증은 그대로 작동 | 규칙을 그대로 지켜 검증 통과가 쉬움            |

**A. 유지 + 경고 그대로 둠**

- 얻는 것: 지금 당장 할 일이 없다.
- 잃는 것: 경고가 20건 가까이 쌓여서 lint:fsd 결과를 아무도 안 보게 된다.
- 실패 시나리오: 진짜 레이어 위반(교차 import 등)이 경고 더미에 묻혀 PR을 그대로 통과한다.

**B. 유지 + 규칙 끄기**

- 얻는 것: 스캐폴드와 문서를 그대로 두면서 검증 결과를 깨끗하게 유지한다.
- 잃는 것: 정말로 합치는 게 나은 작은 슬라이스도 경고로 잡히지 않는다.
- 실패 시나리오: features에 한 줄짜리 슬라이스가 계속 늘어나 구조만 복잡해진다. (코드 리뷰로 보완해야 함)

**C. 페이지로 합치기**

- 얻는 것: FSD 권장 방식 그대로이고, 규칙을 끄지 않아도 된다.
- 잃는 것: 스캐폴드를 크게 고쳐야 하고, 팀원들이 각자 작업 중인 위치가 바뀐다.
- 실패 시나리오: 2주 일정 중간에 구조를 바꾸다가 충돌·누락이 생기고, 승격 시점을 놓쳐 페이지끼리 코드가 중복된다.

## 4. 제안

**B. 구조 유지 + insignificant-slice 규칙 끄기**를 제안한다.
2주 MVP 일정에서 스캐폴드와 아키텍처 문서를 그대로 두는 것이 팀원 간 충돌이 가장 적다.
규칙 하나만 features 범위로 끄면 교차 import·public API 같은 나머지 검증은 계속 작동한다.
MVP 이후 구조를 정리할 때 C로 옮길지 다시 보면 된다.

## 5. 결정 기록

(팀 논의 후 작성)

## 6. 후속 작업

- [ ] 팀 논의 후 결정 기록 작성
- [ ] (B 채택 시) `steiger.config.ts`에 features 대상 `fsd/insignificant-slice` off 추가
- [ ] (C 채택 시) 단일 참조 features 슬라이스를 페이지로 옮기고 ARCHITECTURE.md에 승격 규칙 추가
- [ ] develop에 이미 있는 FSD 오류(public-api 44건 등) 정리는 별도 이슈로 분리
