'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addTransaction } from '@/lib/services/transactionService';

const transactionSchema = z.object({
    type: z.enum(['sale', 'expense', 'purchase', 'credit']),
    amount: z.string().min(1, 'Amount is required'),
    description: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'sale',
            amount: '',
            description: '',
        },
    });

    const onSubmit = async (data: TransactionFormValues) => {
        setLoading(true);
        try {
            const result = await addTransaction(data);
            if (result?.error) {
                alert('Error: ' + result.error);
            } else {
                setOpen(false);
                reset();
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new sale, expense, or purchase.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <div className="col-span-3">
                            <select
                                id="type"
                                {...register('type')}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                            >
                                <option value="sale">Sale (Income)</option>
                                <option value="expense">Expense</option>
                                <option value="purchase">Purchase (Stock)</option>
                                <option value="credit">Credit (Udharo)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount (NPR)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="col-span-3"
                            {...register('amount')}
                        />
                    </div>
                    {errors.amount && (
                        <p className="text-red-500 text-xs ml-[25%] col-span-3">{errors.amount.message}</p>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="e.g. Rice bag, Monthly Rent"
                            className="col-span-3"
                            {...register('description')}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Transaction'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
