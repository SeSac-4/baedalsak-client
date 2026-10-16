# baedalsak-client

배달 서비스 클라이언트. **Feature-Sliced Design(FSD)** 아키텍처 기반의 React SPA입니다.

## 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 코어 | React 19, TypeScript 6, Vite 8 (Rolldown + React Compiler) |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 라우팅 | React Router 7 (선언형 `<Routes>`) |
| 서버 상태 | TanStack Query 5 |
| 클라이언트 상태 | Zustand 5 |
| 폼/검증 | React Hook Form 7 + Zod 4 |
| HTTP | axios |
| 유틸 | clsx, tailwind-merge, class-variance-authority |
| 아키텍처 린트 | `@feature-sliced/steiger-plugin` |

## 요구 사항

- **Node.js 22 LTS** (Vite 8 요구: Node 20.19+ / 22.12+)
- npm (레포에 `package-lock.json` 사용)

## 시작하기

```bash
npm install
npm run dev        # http://localhost:5173
```

### npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (HMR) |
| `npm run build` | 타입 체크(`tsc -b`) 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint |

## Docker (개발 환경 통일)

로컬 Node 버전을 맞추기 어려울 때 컨테이너로 동일한 개발 환경을 띄울 수 있습니다.

```bash
docker build -t baedalsak-client .
docker run --rm -it -p 5173:5173 -v "$PWD":/app -v /app/node_modules baedalsak-client
```

- 소스는 볼륨 마운트로 호스트와 동기화되어 HMR이 동작합니다.
- `/app/node_modules`는 익명 볼륨으로 보존되어 호스트 설치본과 섞이지 않습니다.
- 컨테이너는 `npm run dev -- --host`로 `0.0.0.0`에 바인딩합니다. **개발 전용이며 신뢰할 수 없는 네트워크에 노출하지 마세요.**

## 환경 변수

- Vite 규칙상 **클라이언트에 노출할 값만 `VITE_` 접두사**를 붙입니다. (예: `VITE_API_BASE_URL`)
- 접두사 없는 값은 번들에 포함되지 않습니다.
- `.env`, `.env.*`는 git에서 제외됩니다. 공유용 템플릿은 `.env.example`로 추적하세요.

## 경로 별칭

`@/*` → `src/*` (tsconfig `paths` + `vite-tsconfig-paths`)

```ts
import { LoginPage } from '@/pages/common/login'
```

## 아키텍처: Feature-Sliced Design

### 레이어 (위 → 아래로만 의존)

```
app      → 앱 초기화: 프로바이더 · 라우터 · 전역 스타일 · 엔트리
pages    → 라우트 단위 페이지
widgets  → 독립적인 큰 UI 블록
features → 사용자 상호작용/기능 단위
entities → 비즈니스 엔티티
shared   → 공용 재사용 리소스 (슬라이스 없음)
```

**핵심 규칙:** 상위 레이어만 하위 레이어를 import 할 수 있습니다. 같은 레이어 내 슬라이스끼리의 import(cross-import)는 금지됩니다.

### 슬라이스 / 세그먼트 구조

- **슬라이스**: 각 레이어 안의 도메인 단위 (예: `pages` 레이어의 슬라이스 = 페이지 1개)
- **세그먼트**: 슬라이스 내부의 기술 단위 — `ui` / `model` / `api` / `lib` / `config`
- **public API**: 모든 슬라이스는 루트 `index.ts`로만 외부에 노출

```
src/pages/owner/menu-manage/        ← 슬라이스 (페이지 1개)
├── ui/menu-manage-page.tsx         ← 세그먼트(ui)에 컴포넌트
└── index.ts                        ← public API (export)
```

> `owner`/`customer` 같은 폴더는 **슬라이스 그룹**(단순 분류용 폴더)이며 그 자체는 슬라이스가 아닙니다. 그룹 폴더에 코드를 직접 두지 않습니다.

### 디렉터리 개요

```
src/
├── app/
│   ├── index.tsx           # 엔트리 (createRoot)
│   ├── app.tsx             # 루트 컴포넌트 (BrowserRouter + AppRouter)
│   ├── router/             # 라우트 정의 (app-router.tsx)
│   └── styles/index.css    # 전역 스타일 (@import 'tailwindcss')
├── pages/
│   ├── common/   (login, signup-*, my-page)
│   ├── customer/ (store-list, store-detail, cart, checkout, order-*, payment-*)
│   ├── owner/    (store-*, menu-manage, order-board, order-detail)
│   ├── rider/    (waiting-list, active-delivery)
│   └── not-found/
├── widgets/
├── features/
├── entities/
└── shared/      (api, config, constants, lib, types, ui)
```

> 현재 페이지들은 라우팅 연결용 **더미 컴포넌트** 상태이며, 실제 UI/로직은 이후 단계에서 채웁니다.

### 라우팅

라우트는 `src/app/router/app-router.tsx`에 선언형 `<Routes>`로 중앙 정의되어 있습니다. 새 페이지 추가 시:

1. `src/pages/<group>/<slice>/ui/<slice>-page.tsx` 컴포넌트 작성
2. `src/pages/<group>/<slice>/index.ts`로 export
3. `app-router.tsx`에 `<Route>` 등록

### 아키텍처 검증

```bash
npx steiger src     # FSD 규칙(public API, cross-import 등) 린트
```

## 컨벤션

- **파일명**: kebab-case (`menu-manage-page.tsx`)
- **컴포넌트명**: PascalCase, 페이지는 `~Page` 접미사 (`MenuManagePage`)
- **import**: 슬라이스는 반드시 public API(`index.ts`)를 통해 참조 (세그먼트 내부 직접 import 금지)
