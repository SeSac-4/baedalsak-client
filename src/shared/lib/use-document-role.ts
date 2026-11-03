import { useEffect } from 'react';

/**
 * 역할 강조색을 <html data-role>에 지정한다. body로 띄우는 모달·토스트도 같은 역할색을 쓰게 하려는 것.
 * 화면을 떠나면 지정을 지워 기본(고객) 색으로 돌아간다.
 * @param role - 'CUSTOMER' | 'OWNER' | 'RIDER' (없으면 지정하지 않음)
 */
export const useDocumentRole = (role: string | undefined): void => {
  useEffect(() => {
    if (!role) return;
    const root = document.documentElement;
    root.dataset.role = role;
    return () => {
      delete root.dataset.role;
    };
  }, [role]);
};
