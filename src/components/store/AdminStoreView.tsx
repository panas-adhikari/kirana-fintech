'use client';

import { useState, useEffect } from 'react';
import { getAdminBranches, getAdminAllProducts, getAdminStockReport, createBranch, getCategories } from '@/lib/services/storeManagementService';
import { AdminBranchInfo, AdminProduct, StockReportItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Package, BarChart3, Search, Plus, Filter, Loader2 } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

import { OwnerStoreView } from './OwnerStoreView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function EmptyRow() {
    return (
        <TableRow>
            <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                No data available.
            </TableCell>
        </TableRow>
    );
}

export function AdminStoreView() {
    const { profile } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'branches' | 'products' | 'stock'>('branches');
    const [loading, setLoading] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

    // Data States
    const [branches, setBranches] = useState<AdminBranchInfo[]>([]);
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [stockReport, setStockReport] = useState<StockReportItem[]>([]);

    // Search and Filter States
    const [branchSearch, setBranchSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockSearch, setStockSearch] = useState('');

    // Modal States
    const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchAddress, setNewBranchAddress] = useState('');
    const [creatingBranch, setCreatingBranch] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!profile?.branch?.store_id) return;

            setLoading(true);
            const storeId = profile.branch.store_id;

            if (selectedBranchId) {
                // Optimization: Don't fetch admin list data if focused on a branch
                setLoading(false);
                return;
            }

            if (activeTab === 'branches') {
                const res = await getAdminBranches(storeId);
                if (res.data) setBranches(res.data);
            } else if (activeTab === 'products') {
                const res = await getAdminAllProducts(storeId);
                if (res.data) setProducts(res.data);
            } else if (activeTab === 'stock') {
                const res = await getAdminStockReport(storeId);
                if (res.data) setStockReport(res.data);
            }
            setLoading(false);
        };
        loadData();
    }, [activeTab, profile?.branch?.store_id, selectedBranchId]);

    const handleAddBranch = async () => {
        if (!profile?.branch?.store_id || !newBranchName.trim()) return;

        setCreatingBranch(true);
        const res = await createBranch(profile.branch.store_id, newBranchAddress, newBranchName);
        if (res.success) {
            // Refresh branches
            const updatedBranches = await getAdminBranches(profile.branch.store_id);
            if (updatedBranches.data) setBranches(updatedBranches.data);
            setIsAddBranchOpen(false);
            setNewBranchName('');
            setNewBranchAddress('');
        } else {
            alert(res.error || 'Failed to create branch');
        }
        setCreatingBranch(false);
    };

    // Filter Logic
    const filteredBranches = branches.filter(b =>
        b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())
    );

    const categories = Array.from(new Set(products.map(p => p.category_name).filter(Boolean)));

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category_name === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const filteredStock = stockReport.filter(s =>
        s.product_name.toLowerCase().includes(stockSearch.toLowerCase())
    );

    if (selectedBranchId) {
        return (
            <OwnerStoreView
                adminOverrideBranchId={selectedBranchId}
                onBack={() => setSelectedBranchId(null)}
            />
        );
    }

    return (
        <div className="p-6 space-y-6 flex flex-col h-full overflow-hidden">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Store Administration</h1>

            {/* Dashboard Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Custom Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('branches')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'branches'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        <Store size={16} /> Branches
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'products'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        <Package size={16} /> All Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'stock'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        <BarChart3 size={16} /> Stock Report
                    </button>
                </div>

                {activeTab === 'branches' && (
                    <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Plus size={18} className="mr-2" /> Add New Branch
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Branch</DialogTitle>
                                <DialogDescription>
                                    Add a new branch to your store. This will allow you to manage inventory and sales for this location.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Name</label>
                                    <Input
                                        value={newBranchName}
                                        onChange={(e) => setNewBranchName(e.target.value)}
                                        placeholder="e.g. Kathmandu Main Office"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch Address</label>
                                    <Input
                                        value={newBranchAddress}
                                        onChange={(e) => setNewBranchAddress(e.target.value)}
                                        placeholder="e.g. New Road, Kathmandu"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleAddBranch}
                                    disabled={creatingBranch || !newBranchName.trim()}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {creatingBranch ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                    Create Branch
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Filter/Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder={
                            activeTab === 'branches' ? "Search branches..." :
                                activeTab === 'products' ? "Search inventory (name or SKU)..." :
                                    "Search stock report..."
                        }
                        className="pl-10"
                        value={
                            activeTab === 'branches' ? branchSearch :
                                activeTab === 'products' ? productSearch :
                                    stockSearch
                        }
                        onChange={(e) => {
                            if (activeTab === 'branches') setBranchSearch(e.target.value);
                            else if (activeTab === 'products') setProductSearch(e.target.value);
                            else setStockSearch(e.target.value);
                        }}
                    />
                </div>
                {activeTab === 'products' && (
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <Card className="flex-1 overflow-hidden border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardContent className="p-0 h-full flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Loading data...
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            {activeTab === 'branches' && (
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                                        <TableRow>
                                            <TableHead>Branch Name</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Manager/Owner</TableHead>
                                            <TableHead>Branch ID</TableHead>
                                            <TableHead className="w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBranches.length === 0 ? <EmptyRow /> : filteredBranches.map(b => (
                                            <TableRow key={b.branch_id}>
                                                <TableCell className="font-semibold text-gray-800 dark:text-gray-200">{b.branch_name}</TableCell>
                                                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{b.branch_address || 'No address'}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{b.manager_name}</span>
                                                        <span className="text-xs text-gray-500 capitalize">{b.manager_role}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-400 font-mono">{b.branch_id}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedBranchId(b.branch_id)}>
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            {activeTab === 'products' && (
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                                        <TableRow>
                                            <TableHead>Branch</TableHead>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Use index fallback if product ID not unique across branches (though unlikely) */}
                                        {filteredProducts.length === 0 ? <EmptyRow /> : filteredProducts.map((p, i) => (
                                            <TableRow key={p.product_id + i}><TableCell className="font-medium text-emerald-600">{p.branch_name}</TableCell>
                                                <TableCell>{p.product_name}</TableCell>
                                                <TableCell className="text-xs text-gray-500 font-mono">{p.sku}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock_quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {p.stock_quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell>NPR {p.unit_price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                            {activeTab === 'stock' && (
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead className="text-right">Total Combined Stock</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStock.length === 0 ? <EmptyRow /> : filteredStock.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-semibold">{item.product_name}</TableCell>
                                                <TableCell className="text-gray-500">{item.category_name || 'Uncategorized'}</TableCell>
                                                <TableCell className="text-right font-bold text-lg">{item.total_stock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
