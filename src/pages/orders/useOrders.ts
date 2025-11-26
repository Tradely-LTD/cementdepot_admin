import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetApiV1OrdersQuery,
  usePutApiV1OrdersByIdStatusMutation,
  usePostApiV1OrdersByIdAssignMutation,
  usePostApiV1OrdersByIdCancelMutation,
} from '@/store/coreApiWithTags';

export const useOrders = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [depotId, setDepotId] = useState<string | undefined>(undefined);

  // Fetch orders
  const { data, isLoading, error, refetch } = useGetApiV1OrdersQuery({
    page,
    limit,
    status: status as any,
    depotId,
  });

  // Update order status
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    usePutApiV1OrdersByIdStatusMutation();

  // Assign order
  const [assignOrder, { isLoading: isAssigning }] =
    usePostApiV1OrdersByIdAssignMutation();

  // Cancel order
  const [cancelOrder, { isLoading: isCancelling }] =
    usePostApiV1OrdersByIdCancelMutation();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus({
        id,
        body: {
          status: newStatus as any,
        },
      }).unwrap();
      refetch();
      toast.success('Order status updated successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Failed to update order status';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleAssignOrder = async (id: string, driverId: string) => {
    try {
      await assignOrder({ id, body: { driverId } }).unwrap();
      refetch();
      toast.success('Order assigned successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to assign order';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleCancelOrder = async (id: string, reason: string) => {
    try {
      await cancelOrder({ id, body: { reason } }).unwrap();
      refetch();
      toast.success('Order cancelled successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    orders: data,
    isLoading,
    error,
    page,
    setPage,
    limit,
    status,
    setStatus,
    depotId,
    setDepotId,
    handleUpdateStatus,
    handleAssignOrder,
    handleCancelOrder,
    isUpdatingStatus,
    isAssigning,
    isCancelling,
    refetch,
  };
};
