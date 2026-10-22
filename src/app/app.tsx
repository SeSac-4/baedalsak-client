import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

import { queryClient } from '@/shared/api';
import { ToastProvider } from '@/shared/ui/toast';

import { AppRouter } from './router';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
