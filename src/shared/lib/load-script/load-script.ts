/** 주소별로 한 번만 불러오도록 진행 중·완료된 로딩을 보관한다 */
const loadingScripts = new Map<string, Promise<void>>();

/**
 * 외부 SDK 스크립트를 <head>에 넣고 다 불러올 때까지 기다린다. 같은 주소는 한 번만 불러온다.
 * 실패하면 보관을 지워 다음 호출에서 다시 시도한다.
 * @param src - 스크립트 주소
 * @returns 불러오기가 끝나면 풀리는 Promise
 */
export const loadScript = (src: string): Promise<void> => {
  const loading = loadingScripts.get(src);
  if (loading) return loading;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = (): void => resolve();
    script.onerror = (): void => {
      script.remove();
      loadingScripts.delete(src);
      reject(new Error(`스크립트를 불러오지 못했어요: ${src}`));
    };
    document.head.appendChild(script);
  });

  loadingScripts.set(src, promise);
  return promise;
};
