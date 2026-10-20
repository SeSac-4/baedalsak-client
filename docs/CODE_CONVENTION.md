## 코드 컨벤션

- 컴포넌트: 함수 선언식(`function UserCard() {}`)
- 내부 함수: 함수 표현식(`const fn = () => {}`)
- `let` 지양, `const` 사용
- `.prettierrc` 확인 후 준수
- 함수 하나에 기능 하나, 필요하면 조합
- 모든 함수에 JSDoc 작성
- 타입 항상 명시 (매개변수·반환 타입 포함)
- `forwardRef` 사용 안 함, ref는 props로 받음 (React 19)
