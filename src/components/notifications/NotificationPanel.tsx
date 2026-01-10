'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/useAuthStore';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/firebase/notificationService';
//import { JoinRequestNotification } from './JoinRequestNotification';
import { Button } from '@/components/ui/button';
import { CheckCheck, Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { JoinResponseNotification } from '@/types';

export function NotificationPanel() {
    const { user } = useAuthStore();
    const { notifications, loading, unreadCount } = useNotifications(user?.id);

    const handleMarkAllAsRead = async () => {
        if (user?.id) {
            await markAllNotificationsAsRead(user.id);
        }
    };

    const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
        if (!isRead && user?.id) {
            await markNotificationAsRead(user.id, notificationId);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading notifications...
            </div>
        );
    }

    return (
        <div className="max-h-[500px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="ml-2 text-sm text-emerald-600 dark:text-emerald-400">
                            ({unreadCount} new)
                        </span>
                    )}
                </h3>
                {unreadCount > 0 && (
                    <Button
                        onClick={handleMarkAllAsRead}
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                    >
                        <CheckCheck size={14} className="mr-1" />
                        Mark all read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Inbox size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No notifications</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    notifications.map((notification) => {
                        if (notification.type === 'JOIN_REQUEST') {
                            return (
                                // <JoinRequestNotification
                                //     key={notification.id}
                                //     notification={notification}
                                //     onAction={() => handleNotificationClick(notification.id, notification.read)}
                                // />
                                <div>Notification</div>
                            );
                        }

                        if (notification.type === 'JOIN_APPROVED' || notification.type === 'JOIN_REJECTED') {
                            const responseNotif = notification as JoinResponseNotification;
                            return (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id, notification.read)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                        }`}
                                >
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notification.type === 'JOIN_APPROVED' ? '✓ Request Approved' : '✗ Request Rejected'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Your request to join <span className="font-semibold">{responseNotif.branch_name}</span>{' '}
                                        {notification.type === 'JOIN_APPROVED' ? 'has been approved' : 'was rejected'}
                                        {responseNotif.message && `: ${responseNotif.message}`}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDistanceToNow(notification.created_at, { addSuffix: true })}
                                    </p>
                                </div>
                            );
                        }

                        return null;
                    })
                )}
            </div>
        </div>
    );
}
