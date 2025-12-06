'use server';

import { createServerClient } from '@/lib/supabase/server';
import { Transaction } from '@/types';
import { revalidatePath } from 'next/cache';

// NOTE: using createClient usually implies Server Actions or API routes for write operations
// if we want to call this from client components, we should use the client-side supabase instance.
// But for "server actions" we use the server one.
// Let's implement this as Server Actions (using 'use server') or just helper functions called by Server Actions.
// For simplicity, I will make this a file with Server Actions.

export async function addTransaction(formData: { amount: string; type: 'sale' | 'expense' | 'purchase' | 'credit'; description?: string; payment_method?: string }) {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    // In a real app we would validate the store relationship
    // For now, inserting with some defaults

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return { error: 'Invalid amount' };

    const newTransaction = {
        transaction_type: formData.type, // 'sale', 'expense'
        amount: amount,
        currency: 'NPR',
        description: formData.description,
        payment_method: 'cash', // Default or from form
        status: 'completed',
        created_by: user.id,
        // Fetch store_id for the user
        // store_id: user.store_id // We need store_id.
    };

    // Fetch user's store
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('store_id')
        .eq('id', user.id)
        .single();

    if (userError || !userData?.store_id) {
        // Fallback or error
        // For now, if no store found, we can't insert mostly.
        // But for development, if tables allow null store_id, maybe okay.
        // Let's assume there's a store. If not, we might error out.
        // For the sake of "everything required", I should make sure this works.
        // If I can't find a store, I'll error.
        console.error("No store found for user", user.id);
        return { error: 'No store associated with this user.' };
    }

    const transactionToInsert = {
        ...newTransaction,
        store_id: userData.store_id
    };

    const { data, error } = await supabase
        .from('transactions')
        .insert([transactionToInsert])
        .select();

    if (error) {
        console.error('Error adding transaction:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/transactions');
    revalidatePath('/dashboard');
    return { success: true, data };
}

export async function getTransactions(): Promise<Transaction[]> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    return data as Transaction[];
}
