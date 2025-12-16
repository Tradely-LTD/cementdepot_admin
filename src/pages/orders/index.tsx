import { useState } from 'react';
import { useOrders } from './useOrders';
import {
  useGetApiV1DepotsQuery,
  useGetApiV1OrdersStatsQuery,
} from '@/store/coreApiWithTags';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ShoppingCart,
  MapPin,
  User,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
} from 'lucide-react';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import {
  ORDER_STATUS_OPTIONS,
  getOrderStatusColor,
  formatOrderStatus,
} from '@/utils/constants';

export function Orders() {
  const {
    orders,
    isLoading,
    page,
    setPage,
    status,
    setStatus,
    depotId,
    setDepotId,
    handleUpdateStatus,
    handleCancelOrder,
    isUpdatingStatus,
    isCancelling,
  } = useOrders();

  // Get depots - backend automatically filters by sellerId for sellers
  // Admin sees all depots, Seller sees only their own depots
  // The backend controller automatically adds sellerId filter for sellers
  const { data: depotsData } = useGetApiV1DepotsQuery({});
  const depots = (depotsData as any)?.data || [];

  // Fetch order stats
  const { data: statsData, isLoading: isLoadingStats } =
    useGetApiV1OrdersStatsQuery(undefined);
  const stats = statsData?.data;

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const openStatusDialog = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNotes('');
    setIsStatusDialogOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      const result = await handleUpdateStatus(selectedOrder.id, newStatus);
      if (result.success) {
        setIsStatusDialogOpen(false);
        setSelectedOrder(null);
      }
    }
  };

  const handleCancel = async (order: any) => {
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (reason) {
      await handleCancelOrder(order.id, reason);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer orders
          </p>
        </div>
      </div>

      {/* Order Stats */}
      {!isLoadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pending || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Pending
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {(stats as any).payment_pending || stats.processing || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₦{stats.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Additional Stats Row */}
      {!isLoadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confirmed
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.confirmed || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Out for Delivery
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {(stats as any)?.out_for_delivery ||
                    (stats as any)?.in_transit ||
                    0}
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.delivered || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.cancelled || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select<{ value: string; label: string }>
              value={
                ORDER_STATUS_OPTIONS.find(s => s.value === (status || 'all')) ||
                ORDER_STATUS_OPTIONS[0]
              }
              onChange={(option: { value: string; label: string } | null) =>
                setStatus(option?.value === 'all' ? undefined : option?.value)
              }
              options={ORDER_STATUS_OPTIONS}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: (base: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? '#3b82f6'
                    : state.isSelected
                      ? '#2563eb'
                      : 'transparent',
                  color:
                    state.isFocused || state.isSelected
                      ? 'white'
                      : 'var(--select-text)',
                }),
                singleValue: (base: any) => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Depot</label>
            <Select<{ value: string; label: string }>
              value={
                depotId
                  ? {
                      value: depotId,
                      label:
                        depots.find((d: any) => d.id === depotId)?.name ||
                        depotId,
                    }
                  : null
              }
              onChange={(option: { value: string; label: string } | null) =>
                setDepotId(option?.value || undefined)
              }
              options={[
                { value: '', label: 'All Depots' },
                ...depots.map((depot: any) => ({
                  value: depot.id,
                  label: depot.name,
                })),
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: (base: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? '#3b82f6'
                    : state.isSelected
                      ? '#2563eb'
                      : 'transparent',
                  color:
                    state.isFocused || state.isSelected
                      ? 'white'
                      : 'var(--select-text)',
                }),
                singleValue: (base: any) => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders && (orders as any).data?.length > 0 ? (
            (orders as any).data.map((order: any) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₦{order.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {order.buyer?.fullName || 'Customer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {order.depot?.name || 'Depot'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items?.length || 0} items • {order.deliveryType}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openStatusDialog(order)}
                      disabled={
                        order.status === 'delivered' ||
                        order.status === 'collected' ||
                        order.status === 'cancelled' ||
                        order.status === 'failed'
                      }
                      className="flex-1"
                    >
                      Update Status
                    </Button>
                    {order.status !== 'delivered' &&
                      order.status !== 'collected' &&
                      order.status !== 'cancelled' &&
                      order.status !== 'failed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(order)}
                          disabled={isCancelling}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Cancel
                        </Button>
                      )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No orders found
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Status *
              </label>
              <Select<{ value: string; label: string }>
                value={
                  ORDER_STATUS_OPTIONS.find(s => s.value === newStatus) ||
                  ORDER_STATUS_OPTIONS[1]
                }
                onChange={(option: { value: string; label: string } | null) =>
                  setNewStatus(option?.value || '')
                }
                options={ORDER_STATUS_OPTIONS.filter(s => s.value !== 'all')}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base: any, state: any) => ({
                    ...base,
                    backgroundColor: 'var(--select-bg)',
                    borderColor: state.isFocused
                      ? '#3b82f6'
                      : 'var(--select-border)',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
                  }),
                  menu: (base: any) => ({
                    ...base,
                    backgroundColor: 'var(--select-bg)',
                  }),
                  option: (base: any, state: any) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? '#3b82f6'
                      : state.isSelected
                        ? '#2563eb'
                        : 'transparent',
                    color:
                      state.isFocused || state.isSelected
                        ? 'white'
                        : 'var(--select-text)',
                  }),
                  singleValue: (base: any) => ({
                    ...base,
                    color: 'var(--select-text)',
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
                value={statusNotes}
                onChange={e => setStatusNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingStatus}>
                {isUpdatingStatus ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {orders &&
        (orders as any).pagination &&
        (orders as any).pagination.totalPages > 1 && (
          <div className="flex justify-start mt-4">
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              breakLabel="..."
              breakClassName="break-me"
              pageCount={(orders as any).pagination.totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={selectedItem => setPage(selectedItem.selected + 1)}
              containerClassName="flex items-center space-x-2"
              pageClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              pageLinkClassName="text-gray-700 dark:text-gray-300"
              previousClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              previousLinkClassName="text-gray-700 dark:text-gray-300"
              nextClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              nextLinkClassName="text-gray-700 dark:text-gray-300"
              activeClassName="bg-blue-500 text-white"
              activeLinkClassName="text-white"
              disabledClassName="opacity-50 cursor-not-allowed"
              forcePage={page - 1}
            />
          </div>
        )}
    </div>
  );
}
