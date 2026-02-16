import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronLeft,
  Package,
  MapPin,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Warehouse,
  Route,
  // CircleDollarSign,
  LogOut,
  Tag,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useDispatch } from 'react-redux';
import { logout, useUserSlice } from '@/pages/admin/auth-slice';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  adminOnly?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    path: '/products',
  },
  {
    id: 'brands',
    label: 'Brands',
    icon: Tag,
    path: '/brands',
    adminOnly: true,
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    adminOnly: true,
  },
  {
    id: 'depots',
    label: 'Depots',
    icon: MapPin,
    path: '/depots',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Warehouse,
    path: '/inventory',
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    path: '/orders',
  },
  {
    id: 'routes',
    label: 'Routes',
    icon: Route,
    path: '/routes',
  },
  // {
  //   id: 'pricing',
  //   label: 'Pricing',
  //   icon: CircleDollarSign,
  //   path: '/pricing',
  // },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    path: '/payments',
    adminOnly: true,
  },
  {
    id: 'analysis',
    label: 'Reports',
    icon: BarChart3,
    path: '/analysis',
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { loginResponse } = useUserSlice();
  const user = loginResponse?.data?.user;
  const userRole = user?.role;
  const isAdmin = userRole === 'admin';
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      'AD'
    : 'AD';

  // Filter menu items based on user role
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  // Get current page title based on route
  // const currentMenuItem = filteredMenuItems.find(
  //   item => item.path === location.pathname
  // );
  // const pageTitle = currentMenuItem?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-[#1a1d29] text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded flex items-center justify-center font-bold text-lg">
                C
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-lg">CementDepot</span>
              )}
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Collapse button for desktop */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block text-gray-400 hover:text-white"
            >
              <ChevronLeft
                size={20}
                className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Search */}
          {!sidebarCollapsed && (
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-gray-800 text-sm text-gray-300 rounded px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <svg
                  className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {filteredMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                      title={item.label}
                    >
                      <Icon size={20} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold">
                {initials}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName
                      ? `${user.firstName} ${user.lastName ?? ''}`.trim()
                      : (user?.email ?? 'Admin User')}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {(user?.role ?? 'admin').toUpperCase()}
                  </p>
                </div>
              )}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#1a1d29] text-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-200 hover:text-white"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 lg:ml-0 ml-4">
              {/* <h1 className="text-xl lg:text-2xl font-semibold">{pageTitle}</h1> */}
            </div>

            <div className="flex items-center gap-3">
              <NotificationPanel />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => dispatch(logout())}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
