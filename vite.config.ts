import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_API_PROXY_TARGET = 'http://localhost:8080';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), tsconfigPaths()],
    server: {
      // 쿠키를 같은 출처로 주고받기 위해 /api를 gateway로 넘긴다.
      // 배포 환경에서는 Ingress가 /api를 떼고 넘기므로 개발 서버도 똑같이 뗀다 (/api/v1/stores → /v1/stores)
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || DEFAULT_API_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path: string): string => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
