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
  BarChart3,
  Activity,
} from 'lucide-react';
import { DashboardStatsSkeleton } from '@/loader';

export function Dashboard() {
  const { dashboardData, isLoadingDashboard, dateRange, setDateRange } =
    useDashboard();

  // Extract data from the API response
  const stats = dashboardData?.data;
  const charts = stats?.charts;
  const gisStatus = stats?.gisStatus;

  // Fetch low stock items (threshold: 10)
  const { data: lowStockData, isLoading: isLoadingLowStock } =
    useGetApiV1InventoryLowStockQuery({ threshold: 10 });
  const lowStockItems =
    (lowStockData?.data as any)?.items || lowStockData?.data || [];

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
        <DashboardStatsSkeleton />
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

          {/* GIS Status Alert */}
          {gisStatus && (
            <Card
              className={`p-6 ${
                (gisStatus.depotsWithoutGis ?? 0) > 0
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin
                    className={`h-5 w-5 ${
                      (gisStatus.depotsWithoutGis ?? 0) > 0
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        (gisStatus.depotsWithoutGis ?? 0) > 0
                          ? 'text-yellow-900 dark:text-yellow-100'
                          : 'text-green-900 dark:text-green-100'
                      }`}
                    >
                      GIS Status
                    </h3>
                    <p
                      className={`text-sm ${
                        (gisStatus.depotsWithoutGis ?? 0) > 0
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : 'text-green-700 dark:text-green-300'
                      }`}
                    >
                      {gisStatus.depotsWithGis ?? 0} depots with coordinates,{' '}
                      {gisStatus.depotsWithoutGis ?? 0} without
                    </p>
                  </div>
                </div>
                {(gisStatus.depotsWithoutGis ?? 0) > 0 && (
                  <Link to="/depots">
                    <Button variant="outline" size="sm">
                      Update
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Revenue Trend
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {dateRange.startDate && dateRange.endDate
                      ? `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`
                      : 'Last 7 days performance'}
                  </p>
                </div>
              </div>
              <RevenueChart
                data={(charts?.revenueTrend || []).map((d: any) => ({
                  day: d.day || d.date || '',
                  date: d.date || d.day || '',
                  revenue: d.revenue || 0,
                }))}
              />
            </Card>

            {/* Orders Distribution Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Orders Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Daily order volume
                  </p>
                </div>
              </div>
              <OrdersChart
                data={(charts?.ordersDistribution || []).map((d: any) => ({
                  day: d.day || d.date || '',
                  date: d.date || d.day || '',
                  orders: d.orders || d.count || 0,
                }))}
              />
            </Card>
          </div>

          {/* Product Performance Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Top Products Performance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Best selling products
                </p>
              </div>
            </div>
            <ProductPerformanceChart
              data={(charts?.productPerformance || []).map((d: any) => ({
                name: d.name || '',
                sales: d.sales || 0,
                revenue: d.revenue || 0,
              }))}
            />
          </Card>
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

interface RevenueDataPoint {
  day: string;
  date: string;
  revenue: number;
}

interface OrdersDataPoint {
  day: string;
  date: string;
  orders: number;
}

interface ProductDataPoint {
  name: string;
  sales: number;
  revenue: number;
}

function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        No revenue data available
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const chartHeight = 200;

  return (
    <div className="relative">
      <svg
        width="100%"
        height={chartHeight}
        className="overflow-visible"
        viewBox={`0 0 600 ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={(chartHeight / 4) * i}
            x2="600"
            y2={(chartHeight / 4) * i}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area under line */}
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="rgb(34, 197, 94)"
              stopOpacity="0.3"
              className="dark:stop-opacity-20"
            />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d={`M 0 ${chartHeight} ${data
            .map(
              (d, i) =>
                `L ${(i * 600) / (data.length - 1 || 1)} ${
                  chartHeight - (d.revenue / maxRevenue) * chartHeight * 0.8
                }`
            )
            .join(' ')} L 600 ${chartHeight} Z`}
          fill="url(#revenueGradient)"
        />

        {/* Line */}
        <polyline
          points={data
            .map(
              (d, i) =>
                `${(i * 600) / (data.length - 1 || 1)},${
                  chartHeight - (d.revenue / maxRevenue) * chartHeight * 0.8
                }`
            )
            .join(' ')}
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (i * 600) / (data.length - 1 || 1);
          const y = chartHeight - (d.revenue / maxRevenue) * chartHeight * 0.8;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="rgb(34, 197, 94)"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
        {data.map((d, i) => (
          <span key={i} className="font-medium">
            {d.day}
          </span>
        ))}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-500 pr-2">
        <span>₦{maxRevenue.toLocaleString()}</span>
        <span>₦{(maxRevenue / 2).toLocaleString()}</span>
        <span>₦0</span>
      </div>
    </div>
  );
}

function OrdersChart({ data }: { data: OrdersDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        No orders data available
      </div>
    );
  }

  const maxOrders = Math.max(...data.map(d => d.orders), 1);
  const chartHeight = 200;
  const barWidth = 50;

  return (
    <div className="relative">
      <svg
        width="100%"
        height={chartHeight}
        className="overflow-visible"
        viewBox={`0 0 600 ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={i}
            x1="0"
            y1={(chartHeight / 5) * i}
            x2="600"
            y2={(chartHeight / 5) * i}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
            strokeDasharray="4 4"
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.orders / maxOrders) * chartHeight * 0.8;
          const x = (i * (600 - barWidth)) / (data.length - 1 || 1);
          const y = chartHeight - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill="rgb(59, 130, 246)"
                opacity="0.8"
              />
              {/* Value label on top */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-900 dark:fill-white"
              >
                {d.orders}
              </text>
            </g>
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
        {data.map((d, i) => (
          <span key={i} className="font-medium">
            {d.day}
          </span>
        ))}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-500 pr-2">
        <span>{maxOrders}</span>
        <span>{Math.floor(maxOrders / 2)}</span>
        <span>0</span>
      </div>
    </div>
  );
}

function ProductPerformanceChart({ data }: { data: ProductDataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        No product performance data available
      </div>
    );
  }

  const maxSales = Math.max(...data.map(d => d.sales), 1);

  return (
    <div className="space-y-4">
      {data.map((product, i) => {
        const percentage = (product.sales / maxSales) * 100;
        return (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                {product.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  {product.sales} units
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₦{product.revenue.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
