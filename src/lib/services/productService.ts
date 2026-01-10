'use server';

import { createServerClient } from '@/lib/supabase/server';
import { ProductSearchResult } from '@/types';

export async function searchProducts(branchId: string): Promise<{ data?: ProductSearchResult[]; error?: string }> {
    const supabase = await createServerClient();

    try {
        const { data, error } = await supabase
            .from('products')
            .select(`
                id,
                name,
                sku,
                unit_price,
                stock_quantity,
                is_misc_item,
                category_id,
                product_categories (
                    name
                )
            `)
            .eq('branch_id', branchId)
            .order('name');

        if (error) {
            console.error('Error fetching products:', error);
            return { error: error.message };
        }

        // Transform data to match ProductSearchResult interface
        const products: ProductSearchResult[] = data.map((item: any) => ({
            product_id: item.id,
            product_name: item.name,
            sku: item.sku,
            unit_price: item.unit_price,
            stock_quantity: item.stock_quantity,
            is_misc_item: item.is_misc_item,
            category_id: item.category_id,
            category_name: item.product_categories?.name || null
        }));

        return { data: products };
    } catch (err: any) {
        console.error('Unexpected error fetching products:', err);
        return { error: err.message || 'An unexpected error occurred' };
    }
}
