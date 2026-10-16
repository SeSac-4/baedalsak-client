# syntax=docker/dockerfile:1

# 개발 환경 통일용 Dockerfile (Vite dev server)
# Vite 8은 Node 20.19+ / 22.12+ 필요 → Node 22 LTS 사용
FROM node:22-bookworm-slim

WORKDIR /app

# 의존성 레이어 캐싱: 매니페스트만 먼저 복사 후 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사 (compose에서는 볼륨 마운트로 덮어쓰므로 단독 실행 대비용)
COPY . .

EXPOSE 5173

# 컨테이너 외부에서 접근 가능하도록 --host 바인딩
CMD ["npm", "run", "dev", "--", "--host"]
