// Core entity types for the Kirana Fintech application

export interface Store {
    id: string;
    name: string;
    owner_id: string;
    address: string;
    phone: string;
    email?: string;
    pan_number?: string; // PAN (Permanent Account Number) for Nepal
    registration_number?: string;
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive' | 'suspended';
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: 'owner' | 'staff' | 'admin';
    store_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    store_id: string;
    transaction_type: 'sale' | 'purchase' | 'expense' | 'credit' | 'payment';
    amount: number;
    currency: 'NPR'; // Nepali Rupee
    description?: string;
    customer_name?: string;
    customer_phone?: string;
    payment_method: 'cash' | 'digital' | 'credit';
    status: 'completed' | 'pending' | 'cancelled';
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    store_id: string;
    name: string;
    category: string;
    barcode?: string;
    unit_price: number;
    cost_price?: number;
    stock_quantity: number;
    unit: string; // kg, liter, piece, etc.
    reorder_level?: number;
    supplier?: string;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: string;
    store_id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    credit_limit?: number;
    outstanding_balance: number;
    created_at: string;
    updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    store_name: string;

}