import { useDashboard } from './useDashboard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useGetApiV1InventoryLowStockQuery } from '@/store/coreApiWithTags';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export function Dashboard() {
  const { dashboardData, isLoadingDashboard, dateRange, setDateRange } =
    useDashboard();

  // Extract data from the API response
  const stats = dashboardData?.data;

  // Fetch low stock items (threshold: 10)
  const { data: lowStockData, isLoading: isLoadingLowStock } =
    useGetApiV1InventoryLowStockQuery({ threshold: 10 });
  const lowStockItems = lowStockData?.data?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your business overview
          </p>
        </div>

        <div className="flex space-x-4">
          <div>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={e =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={e =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoadingDashboard ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`₦${stats?.totalRevenue?.toLocaleString() || '0'}`}
              icon={<CreditCard className="h-6 w-6" />}
              color="bg-green-100 dark:bg-green-900"
              iconColor="text-green-600 dark:text-green-400"
            />

            <StatCard
              title="Total Orders"
              value={stats?.totalOrders?.toLocaleString() || '0'}
              icon={<ShoppingCart className="h-6 w-6" />}
              color="bg-blue-100 dark:bg-blue-900"
              iconColor="text-blue-600 dark:text-blue-400"
            />

            <StatCard
              title="Active Products"
              value={stats?.activeProducts?.toLocaleString() || '0'}
              icon={<Package className="h-6 w-6" />}
              color="bg-purple-100 dark:bg-purple-900"
              iconColor="text-purple-600 dark:text-purple-400"
            />

            <StatCard
              title="Active Depots"
              value={stats?.activeDepots?.toLocaleString() || '0'}
              icon={<MapPin className="h-6 w-6" />}
              color="bg-orange-100 dark:bg-orange-900"
              iconColor="text-orange-600 dark:text-orange-400"
            />
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Orders */}
            {stats?.pendingOrders !== undefined && (
              <StatCard
                title="Pending Orders"
                value={stats.pendingOrders.toLocaleString()}
                icon={<Clock className="h-6 w-6" />}
                color="bg-indigo-100 dark:bg-indigo-900"
                iconColor="text-indigo-600 dark:text-indigo-400"
              />
            )}

            {/* Recent Orders Count */}
            {stats?.recentOrders !== undefined && (
              <StatCard
                title="Recent Orders (Last 30 Days)"
                value={stats.recentOrders.toLocaleString()}
                icon={<Calendar className="h-6 w-6" />}
                color="bg-teal-100 dark:bg-teal-900"
                iconColor="text-teal-600 dark:text-teal-400"
              />
            )}
          </div>

          {/* Low Stock Alert */}
          {stats?.lowStockItems !== undefined && stats.lowStockItems > 0 && (
            <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                      Low Stock Alert
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {stats.lowStockItems.toLocaleString()} item
                      {stats.lowStockItems !== 1 ? 's' : ''} with low stock
                    </p>
                  </div>
                </div>
                <Link to="/inventory">
                  <Button variant="outline" size="sm">
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {!isLoadingLowStock && lowStockItems.length > 0 && (
                <div className="space-y-2">
                  {lowStockItems.slice(0, 3).map((item: any) => {
                    const availableQuantity =
                      Number(item.quantity || 0) -
                      Number(item.reservedQuantity || 0);
                    return (
                      <div
                        key={`${item.depotId}-${item.productId}`}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded text-sm"
                      >
                        <span className="text-gray-900 dark:text-white">
                          {item.product?.name || 'Unknown Product'}
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                          {availableQuantity} left
                        </span>
                      </div>
                    );
                  })}
                  {lowStockItems.length > 3 && (
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center pt-1">
                      +{lowStockItems.length - 3} more
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend !== undefined && (
            <p
              className={`text-sm mt-2 flex items-center ${
                trend >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
