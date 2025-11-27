import {
  useGetApiV1NotificationsQuery,
  useGetApiV1NotificationsUnreadCountQuery,
  usePatchApiV1NotificationsByIdReadMutation,
  usePatchApiV1NotificationsReadAllMutation,
} from '@/store/coreApiWithTags';
import { useState } from 'react';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Fetch notifications
  const { data, isLoading, refetch } = useGetApiV1NotificationsQuery({
    page,
    limit,
    isRead: unreadOnly ? false : undefined,
  });

  // Fetch unread count
  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useGetApiV1NotificationsUnreadCountQuery();

  // Mark as read
  const [markAsRead, { isLoading: isMarkingAsRead }] =
    usePatchApiV1NotificationsByIdReadMutation();

  // Mark all as read
  const [markAllAsRead, { isLoading: isMarkingAllAsRead }] =
    usePatchApiV1NotificationsReadAllMutation();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead({ id }).unwrap();
      toast.success('Notification marked as read');
      refetch();
      refetchUnreadCount();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to mark as read';
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
      refetch();
      refetchUnreadCount();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to mark all as read';
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    notifications: data,
    unreadCount: (unreadCountData as any)?.data?.count || 0,
    isLoading,
    page,
    setPage,
    limit,
    unreadOnly,
    setUnreadOnly,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
    refetch,
    refetchUnreadCount,
  };
};
