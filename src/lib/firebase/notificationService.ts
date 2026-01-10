import { ref, push, set, onValue, off, update, remove } from 'firebase/database';
import { db } from '@/lib/firebase/config';
import { Notification } from '@/types';

/**
 * Firebase Notification Service
 * Handles realtime notification delivery and management
 */

/**
 * Send a notification to a specific user
 */
export async function sendNotification(userId: string, notification: Omit<Notification, 'id'>): Promise<{ success: boolean; error?: string; notificationId?: string }> {
    try {
        const notificationsRef = ref(db, `notifications/${userId}`);
        const newNotificationRef = push(notificationsRef);

        const notificationData = {
            ...notification,
            id: newNotificationRef.key,
        };

        await set(newNotificationRef, notificationData);

        return { success: true, notificationId: newNotificationRef.key || undefined };
    } catch (error: any) {
        console.error('[sendNotification] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
        await update(notificationRef, { read: true });
        return { success: true };
    } catch (error: any) {
        console.error('[markNotificationAsRead] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const notificationsRef = ref(db, `notifications/${userId}`);

        // Get all notifications first
        return new Promise((resolve) => {
            onValue(notificationsRef, async (snapshot) => {
                const notifications = snapshot.val();
                if (notifications) {
                    const updates: Record<string, any> = {};
                    Object.keys(notifications).forEach(key => {
                        updates[`${key}/read`] = true;
                    });
                    await update(notificationsRef, updates);
                }
                off(notificationsRef);
                resolve({ success: true });
            }, (error) => {
                console.error('[markAllNotificationsAsRead] Error:', error);
                resolve({ success: false, error: error.message });
            }, { onlyOnce: true });
        });
    } catch (error: any) {
        console.error('[markAllNotificationsAsRead] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a notification
 */
export async function deleteNotification(userId: string, notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
        await remove(notificationRef);
        return { success: true };
    } catch (error: any) {
        console.error('[deleteNotification] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Subscribe to notifications for a user
 * Returns an unsubscribe function
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
): () => void {
    const notificationsRef = ref(db, `notifications/${userId}`);

    const listener = onValue(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const notifications: Notification[] = Object.values(data);
            // Sort by creation date (newest first)
            notifications.sort((a, b) => b.created_at - a.created_at);
            callback(notifications);
        } else {
            callback([]);
        }
    }, (error) => {
        console.error('[subscribeToNotifications] Error:', error);
        callback([]);
    });

    // Return unsubscribe function
    return () => {
        off(notificationsRef, 'value', listener);
    };
}
