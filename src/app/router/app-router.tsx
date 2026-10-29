import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router';

import { LoginPage } from '@/pages/common/login';
import { MyPage } from '@/pages/common/my-page';
import { SignupCustomerPage } from '@/pages/common/signup-customer';
import { SignupOwnerPage } from '@/pages/common/signup-owner';
import { SignupRiderPage } from '@/pages/common/signup-rider';
import { SignupRolePage } from '@/pages/common/signup-role';
import { CartPage } from '@/pages/customer/cart';
import { GalleryPage } from '@/pages/dev/gallery';
import { CheckoutPage } from '@/pages/customer/checkout';
import { OrderDetailPage } from '@/pages/customer/order-detail';
import { OrderListPage } from '@/pages/customer/order-list';
import { PaymentPage } from '@/pages/customer/payment';
import { PaymentDetailPage } from '@/pages/customer/payment-detail';
import { PaymentFailPage } from '@/pages/customer/payment-fail';
import { PaymentListPage } from '@/pages/customer/payment-list';
import { PaymentSuccessPage } from '@/pages/customer/payment-success';
import { StoreDetailPage } from '@/pages/customer/store-detail';
import { StoreListPage } from '@/pages/customer/store-list';
import { NotFoundPage } from '@/pages/not-found';
import { MenuManagePage } from '@/pages/owner/menu-manage';
import { OrderBoardPage } from '@/pages/owner/order-board';
import { OrderDetailPage as OwnerOrderDetailPage } from '@/pages/owner/order-detail';
import { StoreCreatePage } from '@/pages/owner/store-create';
import { StoreManagePage } from '@/pages/owner/store-manage';
import { ActiveDeliveryPage } from '@/pages/rider/active-delivery';
import { WaitingListPage } from '@/pages/rider/waiting-list';

import { useAuthEventHandlers } from '../model/use-auth-event-handlers';
import { AuthGuard } from './guards/auth-guard';
import { GuestGuard } from './guards/guest-guard';
import { OwnerStoreGuard } from './guards/owner-store-guard';
import { RoleGuard } from './guards/role-guard';
import { RoleLayout } from './layouts/role-layout';

/**
 * 앱 라우트. 비로그인 화면은 GuestGuard, 로그인 화면은 AuthGuard → RoleLayout(역할색·메뉴) → RoleGuard(역할별 접근) 순으로 감싼다.
 * @returns 라우트 요소
 */
export function AppRouter(): ReactNode {
  useAuthEventHandlers();

  return (
    <Routes>
      {/* 비로그인 — 로그인 상태면 역할 홈으로 */}
      <Route element={<GuestGuard />}>
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/signup'
          element={<SignupRolePage />}
        />
        <Route
          path='/signup/customer'
          element={<SignupCustomerPage />}
        />
        <Route
          path='/signup/owner'
          element={<SignupOwnerPage />}
        />
        <Route
          path='/signup/rider'
          element={<SignupRiderPage />}
        />
      </Route>

      {/* 로그인 필요 — 역할이 맞지 않으면 내 역할 홈으로 */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleLayout />}>
          {/* 공통 */}
          <Route
            path='/me'
            element={<MyPage />}
          />

          {/* 고객 */}
          <Route element={<RoleGuard role='CUSTOMER' />}>
            <Route
              path='/'
              element={<StoreListPage />}
            />
            <Route
              path='/stores/:storeId'
              element={<StoreDetailPage />}
            />
            <Route
              path='/cart'
              element={<CartPage />}
            />
            <Route
              path='/checkout'
              element={<CheckoutPage />}
            />
            <Route
              path='/orders'
              element={<OrderListPage />}
            />
            <Route
              path='/orders/:orderId'
              element={<OrderDetailPage />}
            />
            <Route
              path='/payment/:orderId'
              element={<PaymentPage />}
            />
            <Route
              path='/payments'
              element={<PaymentListPage />}
            />
            <Route
              path='/payments/:paymentId'
              element={<PaymentDetailPage />}
            />
            <Route
              path='/payment/success'
              element={<PaymentSuccessPage />}
            />
            <Route
              path='/payment/fail'
              element={<PaymentFailPage />}
            />
          </Route>

          {/* 사장님 — 가게 등록 전에는 등록 화면만, 나머지는 내 가게가 있어야 진입 */}
          <Route element={<RoleGuard role='OWNER' />}>
            <Route
              path='/owner/store/new'
              element={<StoreCreatePage />}
            />
            <Route element={<OwnerStoreGuard />}>
              <Route
                path='/owner/store'
                element={<StoreManagePage />}
              />
              <Route
                path='/owner/menus'
                element={<MenuManagePage />}
              />
              <Route
                path='/owner/orders'
                element={<OrderBoardPage />}
              />
              <Route
                path='/owner/orders/:orderId'
                element={<OwnerOrderDetailPage />}
              />
            </Route>
          </Route>

          {/* 라이더 */}
          <Route element={<RoleGuard role='RIDER' />}>
            <Route
              path='/rider'
              element={<WaitingListPage />}
            />
            <Route
              path='/rider/active'
              element={<ActiveDeliveryPage />}
            />
          </Route>
        </Route>
      </Route>

      {/* 개발용 */}
      <Route
        path='/gallery'
        element={<GalleryPage />}
      />

      {/* 폴백 */}
      <Route
        path='*'
        element={<NotFoundPage />}
      />
    </Routes>
  );
}
