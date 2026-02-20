'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';

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
import { useAuthStore } from '@/store/useAuthStore';
import { TransactionInput, TransactionItemInput } from '@/types';

const transactionItemSchema = z.object({
    product_id: z.string().optional(),
    item_description: z.string().min(1, 'Description is required'),
    is_miscellaneous: z.boolean(),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unit_price_at_sale: z.coerce.number().min(0, 'Price cannot be negative'),
});

const transactionSchema = z.object({
    is_walkin: z.boolean(),
    type: z.enum(['Single', 'Bulk']),
    payment_status: z.enum(['Paid', 'Credit', 'Pending']),
    payment_method: z.enum(['Cash', 'Online Payment', 'Credit']),
    items: z.array(transactionItemSchema).min(1, 'At least one item is required'),
});

interface TransactionFormValues {
    is_walkin: boolean;
    type: 'Single' | 'Bulk';
    payment_status: 'Paid' | 'Credit' | 'Pending';
    payment_method: 'Cash' | 'Online Payment' | 'Credit';
    items: {
        product_id?: string;
        item_description: string;
        is_miscellaneous?: boolean;
        quantity: number;
        unit_price_at_sale: number;
    }[];
}

import { searchProducts } from '@/lib/services/productService';
import { ProductSearchResult } from '@/types';
import { useEffect } from 'react';

// ... (existing imports, but remove duplicate React import if present from previous steps)

export function AddTransactionModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductSearchResult[]>([]);
    const { profile } = useAuthStore();

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema) as any,
        defaultValues: {
            is_walkin: true,
            type: 'Single',
            payment_status: 'Paid',
            payment_method: 'Cash',
            items: [{ item_description: '', quantity: 1, unit_price_at_sale: 0, is_miscellaneous: false }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    // Fetch products when modal opens or profile loads
    useEffect(() => {
        if (open && profile?.branch_id) {
            const fetchProducts = async () => {
                const { data, error } = await searchProducts(profile.branch_id);
                if (data) {
                    setProducts(data);
                } else {
                    console.error(error);
                }
            };
            fetchProducts();
        }
    }, [open, profile?.branch_id]);

    const watchedItems = watch('items');
    const totalAmount = watchedItems?.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price_at_sale) || 0), 0) || 0;

    const handleProductSelect = (index: number, productId: string) => {
        const product = products.find(p => p.product_id === productId);
        if (product) {
            setValue(`items.${index}.product_id`, product.product_id);
            setValue(`items.${index}.item_description`, product.product_name);
            setValue(`items.${index}.unit_price_at_sale`, product.unit_price);
            setValue(`items.${index}.is_miscellaneous`, false);
        }
    };

    const onSubmit = async (data: TransactionFormValues) => {
        if (!profile) {
            alert('User profile not found. Please log in again.');
            return;
        }

        setLoading(true);
        try {
            const transactionInput: TransactionInput = {
                ...data,
                user_id: profile.id,
                branch_id: profile.branch_id,
                transaction_date: new Date().toISOString(),
            };

            const result = await addTransaction(transactionInput as any);
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
            <div className="flex items-center gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOpen(true)}>
                    Create New Invoice
                </Button>
                <DialogTrigger asChild>
                    <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Quick Record
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                    <DialogTitle>Create Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new sale or transaction. Select products or add misc items.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit as any)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Transaction Type</Label>
                                <select
                                    {...register('type')}
                                    className="w-full rounded-md border border-gray-200 dark:border-slate-700 bg-transparent p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="Single">Single Sale</option>
                                    <option value="Bulk">Bulk Sale</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Method</Label>
                                <select
                                    {...register('payment_method')}
                                    className="w-full rounded-md border border-gray-200 dark:border-slate-700 bg-transparent p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Online Payment">Online Payment</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2 dark:border-slate-700">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    Items Breakdown
                                    <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full">
                                        {fields.length} {fields.length === 1 ? 'Item' : 'Items'}
                                    </span>
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ item_description: '', quantity: 1, unit_price_at_sale: 0, is_miscellaneous: false })}
                                    className="h-8 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-900/30"
                                >
                                    <Plus size={14} className="mr-1" /> Add Item
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => {
                                    const isMisc = watchedItems?.[index]?.is_miscellaneous;

                                    return (
                                        <div key={field.id} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg items-start border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-colors">
                                            <div className="col-span-1 flex pt-2 justify-center">
                                                <input
                                                    type="checkbox"
                                                    title="Miscellaneous Item"
                                                    {...register(`items.${index}.is_miscellaneous`)}
                                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </div>

                                            <div className="col-span-5 space-y-1">
                                                <Label className="text-[10px] text-gray-400">
                                                    {isMisc ? 'Description (Misc)' : 'Product'}
                                                </Label>

                                                {isMisc ? (
                                                    <Input
                                                        placeholder="Desc"
                                                        {...register(`items.${index}.item_description`)}
                                                        className="h-9 glass"
                                                    />
                                                ) : (
                                                    <select
                                                        className="w-full h-9 rounded-md border border-gray-200 dark:border-slate-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                                                        onChange={(e) => handleProductSelect(index, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Select Product</option>
                                                        {products.map((p) => (
                                                            <option key={p.product_id} value={p.product_id}>
                                                                {p.product_name} ({p.stock_quantity})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}

                                                {errors.items?.[index]?.item_description && (
                                                    <span className="text-[10px] text-red-500 block">{errors.items[index]?.item_description?.message}</span>
                                                )}

                                                {!isMisc && (
                                                    <input
                                                        type="hidden"
                                                        {...register(`items.${index}.item_description`)}
                                                    />
                                                )}
                                            </div>

                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-[10px] text-gray-400 text-center block">Qty</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...register(`items.${index}.quantity`)}
                                                    className="h-9 text-center"
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <Label className="text-[10px] text-gray-400 text-right block">Price</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    {...register(`items.${index}.unit_price_at_sale`)}
                                                    className="h-9 text-right font-medium"
                                                />
                                            </div>
                                            <div className="col-span-1 pt-6 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Grand Total</span>
                            <div className="text-right">
                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">NPR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                <p className="text-[10px] text-gray-400 mt-1">Nepali Rupees Only</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]" disabled={loading}>
                                {loading ? 'Saving Invoice...' : 'Complete & Generate Invoice'}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
