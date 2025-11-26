import { useNotifications } from './useNotifications';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    isLoading,
    unreadOnly,
    setUnreadOnly,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUnreadOnly(!unreadOnly)}
              >
                {unreadOnly ? 'Show All' : 'Unread Only'}
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : notifications && (notifications as any).data?.length > 0 ? (
            (notifications as any).data.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.isRead
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Bell className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                No notifications
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
