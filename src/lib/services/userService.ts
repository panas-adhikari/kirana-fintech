import { supabase } from '../supabase/client';
import { User, Store } from '@/types';

/**
 * Fetches the full profile of a user including branch and store.
 * @param userId The UUID of the user from auth.users
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
    console.log('[getUserProfile] Fetching profile for userId:', userId);
    const { data, error } = await supabase
        .from('users')
        .select(`
            id,
            username,
            role,
            is_active,
            branch_id,
            branch:branches(
                id,
                name,
                store_id,
                store:stores(*)
            ),
            created_at
        `)
        .eq('id', userId)
        .single();

    if (error || !data) {
        if (error) console.error('[getUserProfile] Error fetching user profile:', error);
        return null;
    }
    console.log('[getUserProfile] Successfully fetched profile');

    // Supabase returns nested joins as arrays even for single relationships.
    // We need to transform these into objects to match our User type.
    const rawData = data as any;
    const branch = Array.isArray(rawData.branch) ? rawData.branch[0] : rawData.branch;

    if (branch && Array.isArray(branch.store)) {
        branch.store = branch.store[0];
    }

    return {
        ...rawData,
        branch
    } as User;
};

/**
 * Fetches store details directly by store ID.
 * @param storeId UUID of the store
 */
export const getUserStore = async (storeId: string): Promise<Store | null> => {
    console.log('[getUserStore] Fetching store info for storeId:', storeId);
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

    if (error) {
        console.error('[getUserStore] Error fetching user store:', error);
        return null;
    }
    console.log('[getUserStore] Successfully fetched store info');

    return data as Store;
};
