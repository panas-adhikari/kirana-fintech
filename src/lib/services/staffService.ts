'use server';

import { createAdminClient, createServerClient } from '@/lib/supabase/server';
import { User, StoreMember, UserRole } from '@/types';

/**
 * Fetches all staff members for a specific store or branch.
 * @param storeId The UUID of the store
 * @param branchId Optional branch UUID to filter by
 */
export async function getStaffMembers(storeId: string, branchId?: string): Promise<{ data?: User[]; error?: string }> {
    try {
        const supabase = await createServerClient();

        const { data, error } = await supabase
            .from('users')
            .select(`
                id,
                username,
                role,
                is_active,
                branch_id,
                branch:branches!inner(
                    id,
                    name,
                    store_id
                ),
                created_at
            `)
            .eq('branches.store_id', storeId)
            .in('role', ['staff', 'manager', 'owner'])
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform nested joins if they come as arrays (common in some Supabase versions/configs)
        const mappedData = (data || []).map((user: any) => ({
            ...user,
            branch: Array.isArray(user.branch) ? user.branch[0] : user.branch
        }));

        return { data: mappedData as User[] };
    } catch (e: any) {
        console.error('[getStaffMembers] Error:', e);
        return { error: e.message };
    }
}
/**
 * Adds a new staff member to a store/branch.
 * Note: This currently uses standard signUp which might require a different approach 
 * if we want to avoid signing out the current admin. 
 * If confirmation is disabled, this might sign in the new user automatically.
 */
export async function addStaffMember(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    branchId: string
): Promise<{ success?: boolean; error?: string }> {
    try {
        // 1️⃣ Use Service Role client (server only)
        const supabaseAdmin = await createAdminClient();
        const supabase = await createServerClient();

        // 2️⃣ Create auth user with email auto-confirmed
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // ✅ auto-confirm email
            user_metadata: {
                username,
                role,
                branch_id: branchId
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user account');

        const userId = authData.user.id;

        // 3️⃣ Insert into your public.users table
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: userId,
                username,
                role,
                branch_id: branchId,
                is_active: true
            });

        if (userError) throw userError;

        return { success: true };
    } catch (e: any) {
        console.error('[addStaffMember] Error:', e);
        return { error: e.message };
    }
}
