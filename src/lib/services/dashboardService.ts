'use server';

import { createServerClient } from '@/lib/supabase/server';
import { Transaction } from '@/types';

export async function getDashboardStats() {
    const supabase = await createServerClient();

    // TODO: Replace with real user/store logic
    // For now, assume we fetch for the logged-in user's store or all transactions if no store logic yet

    const { data: { user } } = await supabase.auth.getUser();

    // BYPASS LOGIC: Check if user exists. If not, return Mock Data for demo purposes.
    // In production, this should likely redirect or error out differently if strict auth is needed.
    if (!user) {
        console.warn("No user found. Returning MOCK DATA for dashboard bypass.");
        return {
            cashBalance: 124567.89,
            income: 89750.50,
            expenses: 44519.50,
            profit: 45231.00,
            transactions: [
                {
                    id: 'mock-1',
                    description: 'Mock Sale (Rice)',
                    transaction_type: 'sale',
                    amount: 2500,
                    created_at: new Date().toISOString(),
                },
                {
                    id: 'mock-2',
                    description: 'Mock Expense (Electricity)',
                    transaction_type: 'expense',
                    amount: 1500,
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                }
            ] as Transaction[]
        };
    }

    // Ideally, we get the store_id for the user. 
    // For now, let's fetch all transactions for this user (assuming RLS handles it or we filter by user if table has owner_id)
    // Based on types, Transaction has store_id. User has store_id.

    // 1. Get User's Store (Simplified)
    // const { data: userData } = await supabase.from('users').select('store_id').eq('id', user.id).single();
    // const storeId = userData?.store_id;

    // Fetch transactions
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return {
            cashBalance: 0,
            income: 0,
            expenses: 0,
            profit: 0,
        };
    }

    const txs = transactions as Transaction[];

    const income = txs
        .filter(t => t.transaction_type === 'sale' || t.transaction_type === 'credit') // Assuming 'credit' in is income-like or need specific logic
        .reduce((acc, curr) => acc + (curr.transaction_type === 'sale' ? curr.amount : 0), 0); // Simplified

    const expenses = txs
        .filter(t => t.transaction_type === 'expense' || t.transaction_type === 'purchase')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const profit = income - expenses;
    // Cash balance might be a separate tracked field or cumulative. 
    // For now, let's assume Cash Balance = Total Income - Total Expenses (Simplified)
    const cashBalance = profit;

    return {
        cashBalance,
        income,
        expenses,
        profit, // Or Profit & Loss
        transactions: txs.slice(0, 5) // Recent 5
    };
}

export async function getCashFlowData() {
    // This would aggregation by date
    // For now returning mock structure to be replaced with real aggregation
    return [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
    ];
}
