import { apiClient } from '@/shared/api';

/**
 * 장바구니를 비운다. (204)
 */
export const clearCart = async (): Promise<void> => {
  await apiClient.delete('/cart');
};
