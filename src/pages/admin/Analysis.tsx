import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import {
  useGetApiV1ReportsSalesQuery,
  useGetApiV1ReportsInventoryQuery,
  useGetApiV1ReportsOrdersQuery,
  useGetApiV1ReportsPerformanceQuery,
} from '@/store/coreApiWithTags';
import { toast } from 'sonner';

export function Analysis() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch sales report
  const {
    data: salesData,
    isLoading: isLoadingSales,
    error: salesError,
  } = useGetApiV1ReportsSalesQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Fetch inventory report
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    error: inventoryError,
  } = useGetApiV1ReportsInventoryQuery({});

  // Fetch order report
  const {
    data: orderData,
    isLoading: isLoadingOrders,
    error: orderError,
  } = useGetApiV1ReportsOrdersQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Fetch performance report
  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: performanceError,
  } = useGetApiV1ReportsPerformanceQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const isLoading =
    isLoadingSales ||
    isLoadingInventory ||
    isLoadingOrders ||
    isLoadingPerformance;
  const hasError =
    salesError || inventoryError || orderError || performanceError;

  if (hasError) {
    toast.error('Failed to load report data');
  }

  const sales = salesData?.data;
  const inventory = inventoryData?.data;
  const orders = orderData?.data;
  const performance = performanceData?.data;

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '₦0';
    return `₦${Number(value).toLocaleString('en-NG')}`;
  };

  const formatNumber = (value: number | null | undefined) => {
    if (!value) return '0';
    return Number(value).toLocaleString('en-NG');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Analysis & Reports
          </h2>
          <p className="text-muted-foreground">
            Deep insights into your business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateRange.startDate}
            onChange={e =>
              setDateRange(prev => ({ ...prev, startDate: e.target.value }))
            }
            className="w-auto"
          />
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={e =>
              setDateRange(prev => ({ ...prev, endDate: e.target.value }))
            }
            className="w-auto"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Loading reports...</p>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(sales?.summary?.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(sales?.summary?.totalOrders)} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(orders?.summary?.totalOrders)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatCurrency(orders?.summary?.averageOrderValue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Items
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(inventory?.summary?.totalItems)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(inventory?.summary?.totalAvailable)} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fulfillment Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performance?.summary?.averageFulfillmentDays || '0'} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Average delivery time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sales Report */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
              <CardDescription>
                Sales performance from {dateRange.startDate} to{' '}
                {dateRange.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(sales?.summary?.totalOrders)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(sales?.summary?.totalRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Delivery Fees
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(sales?.summary?.totalDeliveryFees)}
                    </p>
                  </div>
                </div>

                {sales?.byProduct && sales.byProduct.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Top Products</h4>
                    <div className="space-y-2">
                      {sales.byProduct
                        .slice(0, 5)
                        .map((product: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {product.productName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {product.productBrand}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(product.totalRevenue)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(product.totalQuantity)} units
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {sales?.byState && sales.byState.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Sales by State</h4>
                    <div className="space-y-2">
                      {sales.byState
                        .slice(0, 5)
                        .map((state: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {state.state || 'N/A'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(state.totalOrders)} orders
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(state.totalRevenue)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Report */}
          <Card>
            <CardHeader>
              <CardTitle>Order Report</CardTitle>
              <CardDescription>
                Order statistics from {dateRange.startDate} to{' '}
                {dateRange.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(orders?.summary?.totalOrders)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Order Value
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(orders?.summary?.averageOrderValue)}
                    </p>
                  </div>
                </div>

                {orders?.byStatus && orders.byStatus.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Orders by Status</h4>
                    <div className="space-y-2">
                      {orders.byStatus.map((status: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium capitalize">
                              {status.status?.replace('_', ' ') || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatNumber(status.count)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(status.totalRevenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Report */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Report</CardTitle>
              <CardDescription>Current inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(inventory?.summary?.totalItems)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Quantity
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(inventory?.summary?.totalQuantity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(inventory?.summary?.totalAvailable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reserved</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(inventory?.summary?.totalReserved)}
                    </p>
                  </div>
                </div>

                {inventory?.items && inventory.items.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Top Inventory Items</h4>
                    <div className="space-y-2">
                      {inventory.items
                        .slice(0, 5)
                        .map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {item.productName || 'N/A'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Depot: {item.depotName || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatNumber(item.quantity)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Available: {formatNumber(item.available)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Report */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Report</CardTitle>
              <CardDescription>
                Performance metrics from {dateRange.startDate} to{' '}
                {dateRange.endDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Fulfillment Time
                  </p>
                  <p className="text-2xl font-bold">
                    {performance?.summary?.averageFulfillmentDays || '0'} days
                  </p>
                </div>

                {performance?.byDepot && performance.byDepot.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Performance by Depot</h4>
                    <div className="space-y-2">
                      {performance.byDepot.map((depot: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {depot.depotName || 'N/A'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(depot.completedOrders)} /{' '}
                              {formatNumber(depot.totalOrders)} completed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(depot.totalRevenue)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {depot.totalOrders > 0
                                ? Math.round(
                                    (depot.completedOrders /
                                      depot.totalOrders) *
                                      100
                                  )
                                : 0}
                              % completion
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
