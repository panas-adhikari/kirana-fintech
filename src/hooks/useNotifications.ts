'use client';

import { useState, useEffect } from 'react';
import { subscribeToNotifications } from '@/lib/firebase/notificationService';
import { Notification } from '@/types';

/**
 * Hook for subscribing to realtime notifications
 */
export function useNotifications(userId: string | null | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Subscribe to notifications
        const unsubscribe = subscribeToNotifications(userId, (newNotifications) => {
            setNotifications(newNotifications);
            setUnreadCount(newNotifications.filter(n => !n.read).length);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [userId]);

    return {
        notifications,
        loading,
        unreadCount
    };
}
