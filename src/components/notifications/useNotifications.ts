import {
  useGetApiV1NotificationsQuery,
  useGetApiV1NotificationsUnreadCountQuery,
  usePatchApiV1NotificationsByIdReadMutation,
  usePatchApiV1NotificationsReadAllMutation,
} from '@/store/coreApiWithTags';
import { useState } from 'react';

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
      refetch();
      refetchUnreadCount();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Failed to mark as read',
      };
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
      refetchUnreadCount();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Failed to mark all as read',
      };
    }
  };

  return {
    notifications: data,
    unreadCount: (unreadCountData as any)?.count || 0,
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
