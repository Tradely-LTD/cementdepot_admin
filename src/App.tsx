import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Analysis } from '@/pages/admin/Analysis';
import { Products } from '@/pages/products';
import { Depots } from '@/pages/depots';
import { Inventory } from '@/pages/inventory';
import { Orders } from '@/pages/orders';
import { Payments } from '@/pages/payments';
import { Login } from '@/pages/auth/login';
import { NotFound } from '@/pages/NotFound';
import type { RootState } from '@/store/store';
import { DeliveryRoutes } from '@/pages/delivery-routes';
import { Profile } from '@/pages/profile';
import { Brands } from '@/pages/brands';
import { Users } from '@/pages/users';
// import { Pricing } from '@/pages/pricing';
import { useEffect } from 'react';
import { logout } from '@/pages/admin/auth-slice';

const ALLOWED_ROLES = ['seller', 'admin'];

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!authState.loginResponse?.data?.tokens?.accessToken;
  const role = authState.loginResponse?.data?.user?.role;
  const isAuthorized =
    isAuthenticated && role ? ALLOWED_ROLES.includes(role) : false;

  useEffect(() => {
    if (isAuthenticated && !isAuthorized) {
      dispatch(logout());
    }
  }, [dispatch, isAuthenticated, isAuthorized]);

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin-only Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!authState.loginResponse?.data?.tokens?.accessToken;
  const role = authState.loginResponse?.data?.user?.role;
  const isAdmin = role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => !!state.auth.loginResponse?.data?.tokens?.accessToken
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route
                      path="/brands"
                      element={
                        <AdminRoute>
                          <Brands />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <AdminRoute>
                          <Users />
                        </AdminRoute>
                      }
                    />
                    <Route path="/depots" element={<Depots />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/routes" element={<DeliveryRoutes />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/pricing" element={<Pricing />} /> */}
                    <Route
                      path="/payments"
                      element={
                        <AdminRoute>
                          <Payments />
                        </AdminRoute>
                      }
                    />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 for unmatched routes outside protected area */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
