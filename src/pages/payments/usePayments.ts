import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetApiV1PaymentsQuery,
  usePostApiV1PaymentsByIdRefundMutation,
} from '@/store/coreApiWithTags';

const STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'] as const;
export type PaymentStatusFilter = 'all' | (typeof STATUS_OPTIONS)[number];

export const usePayments = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');

  const paymentsQuery = useGetApiV1PaymentsQuery({
    page,
    limit,
    status:
      statusFilter === 'all'
        ? undefined
        : (statusFilter as (typeof STATUS_OPTIONS)[number]),
  });

  const payments = (paymentsQuery.data as any)?.data?.payments ?? [];
  const summary = (paymentsQuery.data as any)?.data?.summary;
  const pagination = (paymentsQuery.data as any)?.data?.pagination;

  const [refundPayment, { isLoading: isRefunding }] =
    usePostApiV1PaymentsByIdRefundMutation();

  const handleRefund = async (paymentId: string, reason?: string) => {
    try {
      await refundPayment({ id: paymentId, body: { reason } }).unwrap();
      paymentsQuery.refetch();
      toast.success('Refund processed successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to process refund';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    payments,
    summary,
    pagination,
    isLoading: paymentsQuery.isLoading,
    error: paymentsQuery.error,
    isRefunding,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    handleRefund,
  };
};
