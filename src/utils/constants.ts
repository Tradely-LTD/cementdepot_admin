// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  CONFIRMED: 'confirmed',
  ASSIGNED: 'assigned',
  READY_FOR_DISPATCH: 'ready_for_dispatch',
  DISPATCHED: 'dispatched',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  COLLECTED: 'collected',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Order Status Options for Select Components
export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.PAYMENT_PENDING, label: 'Payment Pending' },
  { value: ORDER_STATUS.PAYMENT_CONFIRMED, label: 'Payment Confirmed' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.ASSIGNED, label: 'Assigned' },
  { value: ORDER_STATUS.READY_FOR_DISPATCH, label: 'Ready for Dispatch' },
  { value: ORDER_STATUS.DISPATCHED, label: 'Dispatched' },
  { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  { value: ORDER_STATUS.COLLECTED, label: 'Collected' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
  { value: ORDER_STATUS.FAILED, label: 'Failed' },
];

// Status Color Mapping
export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    [ORDER_STATUS.PENDING]:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    [ORDER_STATUS.PAYMENT_PENDING]:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    [ORDER_STATUS.PAYMENT_CONFIRMED]:
      'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    [ORDER_STATUS.CONFIRMED]:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    [ORDER_STATUS.ASSIGNED]:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    [ORDER_STATUS.READY_FOR_DISPATCH]:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    [ORDER_STATUS.DISPATCHED]:
      'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400',
    [ORDER_STATUS.OUT_FOR_DELIVERY]:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
    [ORDER_STATUS.DELIVERED]:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    [ORDER_STATUS.COLLECTED]:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    [ORDER_STATUS.CANCELLED]:
      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    [ORDER_STATUS.FAILED]:
      'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
  };
  return (
    colors[status] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  );
};

// Helper function to format status display text
export const formatOrderStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
