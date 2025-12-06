import { getTransactions } from '@/lib/services/transactionService';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';
import { DashboardWrapper } from '@/components/custom-components/dashboard-component';
import { Transaction } from '@/types';

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <DashboardWrapper>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your sales and expenses</p>
                </div>
                <AddTransactionDialog />
            </div>

            <TransactionTable transactions={(transactions as Transaction[]) || []} />
        </DashboardWrapper>
    );
}
