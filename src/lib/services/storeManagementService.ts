'use server';

import { createServerClient } from '@/lib/supabase/server';
import {
    OwnerBranchInfo,
    OwnerProduct,
    AdminBranchInfo,
    AdminProduct,
    StockReportItem
} from '@/types';

// Helper to verify admin role
async function verifyAdminOrThrow() {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, branch_id')
        .eq('id', user.id)
        .single();

    if (profileError || !profile || profile.role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
    }

    return { supabase, user, profile };
}

// 1. Owner: Get Owner's Branch Info
export async function getOwnerBranchInfo(branchId: string): Promise<{ data?: OwnerBranchInfo; error?: string }> {
    const supabase = await createServerClient();
    // ... existing implementation
    console.log('[getOwnerBranchInfo] Fetching branch info for branchId:', branchId);
    const { data, error } = await supabase
        .from('branches')
        .select(`
            branch_id:id,
            branch_name:name,
            store_id,
            stores (
                store_name:name
            )
        `)
        .eq('id', branchId)
        .single();

    if (error) return { error: error.message };
    return {
        data: {
            branch_id: data.branch_id,
            branch_name: data.branch_name,
            store_id: data.store_id,
            store_name: (data.stores as any)?.store_name
        }
    };
}

// 2. Owner: Get Products in Owner's Branch
export async function getOwnerProducts(branchId: string): Promise<{ data?: OwnerProduct[]; error?: string }> {
    const supabase = await createServerClient();
    // ... existing implementation
    const { data, error } = await supabase
        .from('products')
        .select(`
            product_id:id,
            product_name:name,
            sku,
            unit_price,
            stock_quantity,
            is_misc_item,
            product_categories (
                name
            )
        `)
        .eq('branch_id', branchId)
        .order('name');

    if (error) return { error: error.message };

    const mappedData = data.map((item: any) => ({
        ...item,
        category_name: Array.isArray(item.product_categories) ? item.product_categories[0]?.name : item.product_categories?.name
    }));

    return { data: mappedData };
}

// 3. Update Product Price (Shared)
export async function updateProductPrice(productId: string, newPrice: number, branchId: string): Promise<{ success?: boolean; error?: string }> {
    // Determine if we need admin privs (if checking user's branch != target branchId)
    // But for simplicity, let's keep it simple: Try standard, if fails, check if admin and use system.
    // Actually, simplest is:
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // Check user profile to see if they are admin or owner of this branch
    const { data: profile } = await supabase.from('users').select('role, branch_id').eq('id', user.id).single();

    let dbClient = supabase;
    if (profile?.branch_id !== branchId) {
        if (profile?.role === 'admin') {
            // Admin editing another branch
            console.log('[updateProductPrice] Admin override for branch:', branchId);
        } else {
            return { error: 'Forbidden: You can only manage your own branch.' };
        }
    }

    const { error } = await dbClient
        .from('products')
        .update({ unit_price: newPrice })
        .eq('id', productId);

    if (error) return { error: error.message };
    return { success: true };
}

// 4. Add Product (Shared)
export async function addProduct(product: {
    name: string;
    category_id: string;
    sku: string;
    unit_price: number;
    stock_quantity: number;
    is_misc_item: boolean;
}, branchId: string): Promise<{ success?: boolean; error?: string }> {

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('users').select('role, branch_id').eq('id', user.id).single();

    let dbClient = supabase;
    if (profile?.branch_id !== branchId) {
        if (profile?.role === 'admin') {
            console.log('[addProduct] Admin override for branch:', branchId);
        } else {
            return { error: 'Forbidden' };
        }
    }

    const { error } = await dbClient
        .from('products')
        .insert({
            name: product.name,
            category_id: product.category_id,
            sku: product.sku,
            unit_price: product.unit_price,
            stock_quantity: product.stock_quantity,
            is_misc_item: product.is_misc_item,
            branch_id: branchId
        });

    if (error) return { error: error.message };
    return { success: true };
}

// 5. Admin: List All Branches
export async function getAdminBranches(storeId: string): Promise<{ data?: AdminBranchInfo[]; error?: string }> {
    try {
        const { supabase } = await verifyAdminOrThrow();
        // 1. Fetch branches and embedded store name
        const { data: branches, error: branchesError } = await supabase
            .from('branches')
            .select(`
                id,
                name,
                address,
                store_id,
                stores (
                    name
                )
            `)
            .eq('store_id', storeId);
        if (branchesError) throw branchesError;
        if (!branches || branches.length === 0) return { data: [] };

        // 2. Gather branch ids
        const branchIds = branches.map(b => b.id);
        console.log("branchids", branchIds);
        // 3. Fetch active users who are owner/manager for these branches
        const { data: managers, error: managersError } = await supabase
            .from('users')
            .select('id, username, role, is_active, branch_id')
            .in('branch_id', branchIds)
            .in('role', ['manager', 'owner'])
            .eq('is_active', true);
        if (managersError) throw managersError;
        console.log('managers', managers);
        // 4. Map one manager per branch (prefer role='manager' if both exist)
        const managerByBranch: Record<string, any> = {};
        (managers || []).forEach(m => {
            if (!managerByBranch[m.branch_id] || m.role === 'manager') {
                managerByBranch[m.branch_id] = m;
            }
        });

        // 5. Build final result shape matching AdminBranchInfo interface
        const mappedData: AdminBranchInfo[] = branches.map(b => ({
            branch_id: b.id,
            branch_name: b.name,
            store_id: b.store_id,
            store_name: (b.stores as any)?.name || 'N/A',
            manager_name: managerByBranch[b.id]?.username || 'No Manager assigned',
            manager_role: managerByBranch[b.id]?.role || 'N/A',
            branch_address: b.address
        }));

        return { data: mappedData };

    } catch (e: any) {
        console.error('[getAdminBranches] Error:', e);
        return { error: e.message };
    }
}

// 6. Admin: Products in All Branches
export async function getAdminAllProducts(storeId: string): Promise<{ data?: AdminProduct[]; error?: string }> {
    try {
        const { supabase } = await verifyAdminOrThrow();

        const { data, error } = await supabase
            .from('products')
            .select(`
                product_id:id,
                product_name:name,
                sku,
                unit_price,
                stock_quantity,
                is_misc_item,
                product_categories (
                    name
                ),
                branches!inner (
                    id,
                    name,
                    store_id
                )
            `)
            .eq('branches.store_id', storeId)
            .order('name');

        if (error) throw error;

        const mappedData = data.map((item: any) => {
            const cat = Array.isArray(item.product_categories) ? item.product_categories[0] : item.product_categories;
            const branch = Array.isArray(item.branches) ? item.branches[0] : item.branches;

            return {
                product_id: item.product_id,
                product_name: item.product_name,
                sku: item.sku,
                unit_price: item.unit_price,
                stock_quantity: item.stock_quantity,
                is_misc_item: item.is_misc_item,
                category_name: cat?.name || null,
                branch_id: branch?.id,
                branch_name: branch?.name
            };
        });

        mappedData.sort((a: any, b: any) => (a.branch_name === b.branch_name) ? a.product_name.localeCompare(b.product_name) : a.branch_name.localeCompare(b.branch_name));

        return { data: mappedData };
    } catch (e: any) {
        console.error(e);
        return { error: e.message };
    }
}

// 7. Admin: Combined Stock Report
export async function getAdminStockReport(storeId: string): Promise<{ data?: StockReportItem[]; error?: string }> {
    // Reuses getAdminAllProducts which is already secured
    const result = await getAdminAllProducts(storeId);
    if (result.error || !result.data) return { error: result.error };

    const products = result.data;
    const aggregationMap = new Map<string, StockReportItem>();

    products.forEach(p => {
        const key = `${p.product_name}|${p.category_name}`;
        if (!aggregationMap.has(key)) {
            aggregationMap.set(key, {
                product_name: p.product_name,
                category_name: p.category_name,
                total_stock: 0
            });
        }
        const item = aggregationMap.get(key)!;
        item.total_stock += p.stock_quantity;
    });

    return { data: Array.from(aggregationMap.values()).sort((a, b) => a.product_name.localeCompare(b.product_name)) };
}

// 8. General: Get Categories
export async function getCategories(branchId: string): Promise<{ data?: { id: string; name: string }[]; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser(); // Check auth

    // Potentially might need admin override if fetching for another branch? 
    // Usually reading categories is fine for authenticated users, but let's be safe.
    // If strict RLS: same logic as products.
    // Let's assume reading is open to store members, but if RLS blocks, we might need system.
    // Given the pattern, let's just stick to server client for now unless reported otherwise.

    const { data, error } = await supabase
        .from('product_categories')
        .select('id, name')
        .eq('branch_id', branchId)
        .order('name');

    if (error) return { error: error.message };
    return { data };
}

// 9. General: Add Category
export async function addCategory(name: string, branchId: string): Promise<{ success?: boolean; error?: string; data?: { id: string; name: string } }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('users').select('role, branch_id').eq('id', user.id).single();

    let dbClient = supabase;
    if (profile?.branch_id !== branchId) {
        if (profile?.role === 'admin') {
            // Admin override
        } else {
            return { error: 'Forbidden' };
        }
    }

    const { data, error } = await dbClient
        .from('product_categories')
        .insert({
            name,
            branch_id: branchId
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, data };
}
// 10. Public: Get All Stores (for joining)
export async function getAllStores(): Promise<{ data?: { id: string, name: string }[]; error?: string }> {
    const supabase = await createServerClient();

    // We use service role or just standard select if RLS allows public read of store names
    // For now, let's assume public read is allowed or we use the server client which has user context if logged in, 
    // but here the user is NOT logged in yet.
    // However, createServerClient() usually uses the session.
    // If we want to allow unauthenticated users to see store list, we might need a bypass or specific RLS.

    const { data, error } = await supabase
        .from('stores')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('[getAllStores] Error:', error);
        return { error: error.message };
    }
    return { data };
}

// 11. Public: Get Store Branches (for joining)
export async function getStoreBranches(storeId: string): Promise<{ data?: { id: string, name: string }[]; error?: string }> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .eq('store_id', storeId)
        .order('name');

    if (error) {
        console.error('[getStoreBranches] Error:', error);
        return { error: error.message };
    }
    return { data: data };
}

// 12. Admin: Create New Branch
export async function createBranch(storeId: string, branchAddress: string, branchName: string): Promise<{ success?: boolean; error?: string; data?: { id: string; name: string } }> {
    try {
        const { supabase } = await verifyAdminOrThrow();

        const { data, error } = await supabase
            .from('branches')
            .insert({
                name: branchName,
                address: branchAddress,
                store_id: storeId
            })
            .select()
            .single();

        if (error) {
            console.error('[createBranch] Supabase error:', error);
            throw error;
        }

        return { success: true, data: { id: data.id, name: data.name } };
    } catch (e: any) {
        console.error('[createBranch] Error:', e);
        return { error: e.message };
    }
}
