# baedalsak-client

배달 서비스 클라이언트 (React SPA, FSD 아키텍처)

## 명령어

- 개발 서버: `npm run dev`
- 린트: `npm run lint`
- 타입·빌드: `npm run build`
- FSD 검증: `npx steiger src`

## 작업 규칙

- 작업 완료 전 린트·빌드·FSD 검증 모두 통과 확인
- 패키지 설치, `.env` 수정은 먼저 확인 요청
- 문제가 생기거나 더 나은 대안이 있으면 바로 바꾸지 말고 ADR 형식으로 제안
- 아래 문서의 규칙을 따른다
- 기존 코드는 컨벤션 적용 전이라 규칙과 다른 곳이 있음. 기존 코드가 아니라 문서를 기준으로 작성

## 문서

- 아키텍처·기술 스택: @docs/ARCHITECTURE.md
- 코드 작성: @docs/CODE_CONVENTION.md
- 네이밍: @docs/NAMING_CONVENTION.md
- Git: @docs/GIT_CONVENTION.md
- 의사결정(ADR): @docs/ADR_CONVENTION.md
