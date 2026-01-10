'use server';

import { createServerClient } from '@/lib/supabase/server';
import { Transaction, TransactionInput } from '@/types';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData: TransactionInput) {
    const supabase = await createServerClient();

    // Get current user
    console.log('[addTransaction] Starting transaction creation');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('[addTransaction] Unauthorized: No user found');
        return { error: 'Unauthorized' };
    }

    // In a real app we would validate the store relationship
    // For now, inserting with some defaults

    // We calculate total amount for the main transaction record
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price_at_sale), 0);

    const transactionToInsert = {
        transaction_type: 'sale', // We might need to map formData.type to this
        amount: totalAmount,
        currency: 'NPR',
        description: formData.items.map(i => i.item_description).join(', '),
        payment_method: formData.payment_method.toLowerCase(),
        status: formData.payment_status === 'Paid' ? 'completed' : 'pending',
        created_by: formData.user_id,
        branch_id: formData.branch_id,
    };

    // Fetch user's store
    // Fetch user's store
    console.log('[addTransaction] Fetching store for user:', user.id);
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('branch:branches(store_id)')
        .eq('id', user.id)
        .single();

    const storeId = (userData?.branch as any)?.store_id;

    if (userError || !storeId) {
        console.error("No store found for user", user.id);
        return { error: 'No store associated with this user.' };
    }

    console.log('[addTransaction] Inserting transaction for storeId:', storeId);
    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            ...transactionToInsert,
            store_id: storeId
        }])
        .select();

    if (error) {
        console.error('Error adding transaction:', error);
        return { error: error.message };
    }

    console.log('[addTransaction] Successfully added transaction');

    // Note: In a production app, we would also insert the individual items into a 'transaction_items' table.
    // For now, we are just storing the main transaction record.

    revalidatePath('/dashboard/transactions');
    revalidatePath('/dashboard');
    return { success: true, data };
}

export async function getTransactions(): Promise<Transaction[]> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    console.log('[getTransactions] Fetching transactions for user:', user.id);
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }

    if (data) console.log(`[getTransactions] Fetched ${data.length} transactions`);

    return data as Transaction[];
}
