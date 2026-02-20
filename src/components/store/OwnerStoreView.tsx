'use client';

import { useState, useEffect } from 'react';
import { getOwnerProducts, updateProductPrice, addProduct, getCategories, addCategory } from '@/lib/services/storeManagementService';
import { OwnerProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category_id: z.string().min(1, 'Category is required'),
    sku: z.string().min(1, 'SKU is required'),
    unit_price: z.coerce.number().min(0, 'Price must be 0 or more'),
    stock_quantity: z.coerce.number().min(0, 'Stock must be 0 or more'),
    is_misc_item: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface OwnerStoreViewProps {
    adminOverrideBranchId?: string;
    onBack?: () => void;
}

export function OwnerStoreView({ adminOverrideBranchId, onBack }: OwnerStoreViewProps) {
    const { profile } = useAuthStore();
    const effectiveBranchId = adminOverrideBranchId || profile?.branch_id;

    const [products, setProducts] = useState<OwnerProduct[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    // Mode States
    const [isCreatingCategory, setIsCreatingCategory] = useState(false); // Kept for inline if needed, but primary is now dialog
    const [newCategoryName, setNewCategoryName] = useState('');

    // ... existing filters ...

    // Mode States
    // ...

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const filteredProducts = products.filter(product => {
        // Search Filter
        if (searchQuery && !product.product_name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        // Category Filter
        if (filterCategory !== 'all' && product.category_name !== filterCategory) {
            return false;
        }
        // Price Filter
        const price = product.unit_price;
        if (minPrice && price < Number(minPrice)) return false;
        if (maxPrice && price > Number(maxPrice)) return false;

        return true;
    });

    const loadData = async () => {
        console.log('[OwnerStoreView] loadData called. Effective Branch:', effectiveBranchId);
        if (!effectiveBranchId) {
            console.warn('[OwnerStoreView] No branch_id available, skipping fetch.');
            return;
        }

        setLoading(true);
        try {
            console.log('[OwnerStoreView] Invoking Server Action: getOwnerProducts with ID:', effectiveBranchId);
            const [productsRes, categoriesRes] = await Promise.all([
                getOwnerProducts(effectiveBranchId),
                getCategories(effectiveBranchId),
            ]);

            console.log('[OwnerStoreView] Server Action Response - Products:', productsRes);
            console.log('[OwnerStoreView] Server Action Response - Categories:', categoriesRes);

            if (productsRes.data) setProducts(productsRes.data);
            else console.error('[OwnerStoreView] Product Error:', productsRes.error);

            if (categoriesRes.data) setCategories(categoriesRes.data);
            else console.error('[OwnerStoreView] Category Error:', categoriesRes.error);

        } catch (err) {
            console.error('[OwnerStoreView] CRITICAL FETCH ERROR:', err);
            alert('Error fetching data: ' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('[OwnerStoreView] useEffect triggered. Effective Branch:', effectiveBranchId);
        if (effectiveBranchId) {
            loadData();
        } else {
            console.log('[OwnerStoreView] Waiting for branch_id...');
        }
    }, [effectiveBranchId]);

    const handleEditClick = (product: OwnerProduct) => {
        setEditingId(product.product_id);
        setEditPrice(product.unit_price);
    };

    const handleSavePrice = async (productId: string) => {
        if (!effectiveBranchId) return;

        const { error } = await updateProductPrice(productId, editPrice, effectiveBranchId);
        if (error) {
            alert('Failed to update price: ' + error);
        } else {
            setProducts(products.map(p => p.product_id === productId ? { ...p, unit_price: editPrice } : p));
            setEditingId(null);
        }
    };


    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        if (!effectiveBranchId) {
            alert('Error: No branch assigned.');
            return;
        }

        const { success, data, error } = await addCategory(newCategoryName, effectiveBranchId);
        if (success && data) {
            setCategories([...categories, data]);
            // If called from main dialog
            if (isAddCategoryOpen) {
                setIsAddCategoryOpen(false);
            }
            // If called from inline (if we keep it)
            if (isCreatingCategory) {
                form.setValue('category_id', data.id);
                setIsCreatingCategory(false);
            }
            setNewCategoryName('');
        } else {
            alert('Failed to create category: ' + error);
        }
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: '',
            sku: '',
            unit_price: 0,
            stock_quantity: 0,
            category_id: '',
            is_misc_item: false,
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onAddSubmit = async (data: ProductFormValues) => {
        if (!effectiveBranchId) {
            alert('Error: No branch assigned to user session.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await addProduct(data, effectiveBranchId);
            if (error) {
                alert('Failed to add product: ' + error);
            } else {
                setIsAddOpen(false);
                form.reset();
                loadData(); // Reload to see new product
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                                &larr; Back
                            </Button>
                        )}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Store Inventory</h1>
                        <Button variant="outline" size="sm" onClick={loadData}>
                            Refresh Data
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    <Plus size={16} className="mr-2" /> Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Category Name</Label>
                                        <Input
                                            placeholder="e.g. Spices"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateCategory}>Save Category</Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Plus size={16} className="mr-2" /> Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={form.handleSubmit(onAddSubmit as any)} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Product Name</Label>
                                        <Input {...form.register('name')} placeholder="e.g. Basmati Rice" />
                                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label>Category</Label>
                                            {!isCreatingCategory ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingCategory(true)}
                                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                                >
                                                    + Add New
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingCategory(false)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        {isCreatingCategory ? (
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="New Category Name"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                />
                                                <Button type="button" onClick={handleCreateCategory} size="sm">Save</Button>
                                            </div>
                                        ) : (
                                            <Select onValueChange={(val) => form.setValue('category_id', val)} defaultValue={form.watch('category_id')}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        {form.formState.errors.category_id && <p className="text-red-500 text-xs">{form.formState.errors.category_id.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>SKU</Label>
                                            <Input {...form.register('sku')} placeholder="SKU-123" />
                                            {form.formState.errors.sku && <p className="text-red-500 text-xs">{form.formState.errors.sku.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Stock</Label>
                                            <Input type="number" {...form.register('stock_quantity')} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Unit Price (NPR)</Label>
                                        <Input type="number" {...form.register('unit_price')} />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Product'
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg flex flex-wrap gap-4 items-end border border-gray-200 dark:border-slate-700">
                    <div className="w-full md:w-64 space-y-1">
                        <Label className="text-xs text-gray-500">Search Name</Label>
                        <Input
                            placeholder="Search product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-slate-900"
                        />
                    </div>
                    <div className="w-48 space-y-1">
                        <Label className="text-xs text-gray-500">Category</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="bg-white dark:bg-slate-900">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 items-end">
                        <div className="w-24 space-y-1">
                            <Label className="text-xs text-gray-500">Min Price</Label>
                            <Input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="bg-white dark:bg-slate-900"
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            <Label className="text-xs text-gray-500">Max Price</Label>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>
                    {(searchQuery || filterCategory !== 'all' || minPrice || maxPrice) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchQuery('');
                                setFilterCategory('all');
                                setMinPrice('');
                                setMaxPrice('');
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            Reset filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 flex-1 overflow-auto shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">Loading inventory...</TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No products match your filters.</TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{product.product_name}</TableCell>
                                    <TableCell>{product.category_name || '-'}</TableCell>
                                    <TableCell className="text-xs text-gray-500 font-mono">{product.sku}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock_quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.product_id ? (
                                            <Input
                                                type="number"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                                className="w-24 h-8"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-semibold">NPR {product.unit_price}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.product_id ? (
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleSavePrice(product.product_id)}>
                                                    <Save size={16} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setEditingId(null)}>
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(product)}>
                                                <Edit2 size={14} />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
