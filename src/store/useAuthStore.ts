import { create } from 'zustand';
import { User } from '@/types';
import { getUserProfile } from '@/lib/services/userService';

interface AuthState {
    profile: User | null;
    user: { id: string } | null;
    loading: boolean;
    initialized: boolean;
    error: string | null;
    setProfile: (profile: User | null) => void;
    fetchProfile: (userId: string) => Promise<void>;
    clearAuth: () => void;
}


export const useAuthStore = create<AuthState>((set, get) => ({
    profile: null,
    user: null,
    loading: false,
    initialized: false,
    error: null,

    setProfile: (profile) => set({
        profile,
        user: profile ? { id: profile.id } : null,
        loading: false,
        initialized: true
    }),

    fetchProfile: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const profile = await getUserProfile(userId);
            set({
                profile,
                user: profile ? { id: profile.id } : null,
                loading: false,
                initialized: true
            });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch profile', loading: false, initialized: true });
        }
    },

    clearAuth: () => set({ profile: null, user: null, loading: false, initialized: false, error: null }),
}));
