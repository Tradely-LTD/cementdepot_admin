import { useState } from 'react';
import { usePayments, type PaymentStatusFilter } from './usePayments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { OrderListSkeleton } from '@/loader';

const PAYMENT_STATUSES = [
  { value: 'all', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'refunded':
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    completed:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    refunded:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export function Payments() {
  const {
    payments,
    summary,
    pagination,
    isLoading,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    handleRefund,
    isRefunding,
  } = usePayments();

  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundFormData, setRefundFormData] = useState({
    paymentId: '',
    amount: 0,
    reason: '',
  });

  const openRefundDialog = (payment: any) => {
    setRefundFormData({
      paymentId: payment.id,
      amount: payment.amount,
      reason: '',
    });
    setIsRefundDialogOpen(true);
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleRefund(
      refundFormData.paymentId,
      refundFormData.reason
    );
    if (result.success) {
      setIsRefundDialogOpen(false);
      setRefundFormData({ paymentId: '', amount: 0, reason: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payments
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage payment transactions
          </p>
        </div>
      </div>

      {/* Filter */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Status
            </label>
            <Select<{ value: string; label: string }>
              value={
                PAYMENT_STATUSES.find(s => s.value === statusFilter) ||
                PAYMENT_STATUSES[0]
              }
              onChange={(option: { value: string; label: string } | null) =>
                setStatusFilter((option?.value || 'all') as PaymentStatusFilter)
              }
              options={PAYMENT_STATUSES}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': { borderColor: '#3b82f6' },
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
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500">Volume (₦)</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              ₦{summary?.totalVolume?.toLocaleString() ?? '0'}
            </p>
          </div>
          <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500">Completed Payments</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {summary?.completed ?? 0}
            </p>
          </div>
        </div>
      </Card>

      {/* Payments List */}
      {isLoading ? (
        <OrderListSkeleton count={5} />
      ) : (
        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment: any) => (
              <Card key={payment.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Payment #{payment.reference}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Order ID: {payment.orderId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          {payment.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Amount
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ₦{payment.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Payment Method
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {payment.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString()
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {payment.status === 'completed' && (
                    <div className="lg:ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRefundDialog(payment)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refund
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No payments found
              </p>
            </Card>
          )}

          {pagination?.totalPages > 1 && (
            <div className="flex justify-start mt-4">
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pagination.totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={selectedItem =>
                  setPage(selectedItem.selected + 1)
                }
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
      )}

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRefundSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Refund Amount (₦) *
              </label>
              <Input
                type="number"
                value={refundFormData.amount}
                onChange={e =>
                  setRefundFormData({
                    ...refundFormData,
                    amount: Number(e.target.value),
                  })
                }
                placeholder="Amount to refund"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
                value={refundFormData.reason}
                onChange={e =>
                  setRefundFormData({
                    ...refundFormData,
                    reason: e.target.value,
                  })
                }
                placeholder="Reason for refund..."
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRefundDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isRefunding}>
                {isRefunding ? 'Processing...' : 'Process Refund'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
