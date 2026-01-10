// Core entity types for the Kirana Fintech application

// Core entity types for the Kirana Fintech application

export interface Store {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive' | 'suspended';
}

export interface Branch {
    id: string;
    name: string;
    store_id: string;
    store: Store;
}

export interface User {
    id: string;
    username: string;
    role: 'owner' | 'staff' | 'admin' | 'user' | 'manager';
    is_active: boolean;
    branch_id: string;
    branch: Branch;
    created_at: string;
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
    name: string;
    phone: string;
    store_name: string;
}export interface TransactionItemInput {
    product_id?: string;         // Optional if misc item
    item_description?: string;   // Required if misc item
    is_miscellaneous?: boolean;  // True if product_id is null
    quantity: number;            // Number of units sold
    unit_price_at_sale: number;  // Price per unit at time of sale
}

export interface TransactionInput {
    branch_id: string;          // Branch where the sale is happening
    user_id: string;            // Who is recording the transaction
    customer_id?: string;       // Optional: registered customer
    is_walkin: boolean;         // True if the customer is not registered
    type: 'Single' | 'Bulk';    // Sale type
    payment_status: 'Paid' | 'Credit' | 'Pending';
    payment_method: 'Cash' | 'Online Payment' | 'Credit';
    transaction_date?: string;  // Defaults to now()
    items: TransactionItemInput[]; // List of products/items sold
}

export interface ProductSearchResult {
    product_id: string;
    product_name: string;
    sku: string;
    unit_price: number;
    stock_quantity: number;
    is_misc_item: boolean;
    category_id: string;
    category_name: string | null;
}

// Store Management Types

export interface OwnerBranchInfo {
    branch_id: string;
    branch_name: string;
    store_id: string;
    store_name: string;
}

export interface OwnerProduct {
    product_id: string;
    product_name: string;
    sku: string;
    unit_price: number;
    stock_quantity: number;
    is_misc_item: boolean;
    category_name: string | null;
}

export interface AdminBranchInfo {
    branch_id: string;
    branch_name: string;
    store_id: string;
    store_name: string;
    manager_name?: string;
    manager_role?: string;
    branch_address?: string;
}

export interface AdminProduct extends OwnerProduct {
    branch_id: string;
    branch_name: string;
}

export interface StockReportItem {
    product_name: string;
    category_name: string | null;
    total_stock: number;
}

// Join Request & Notification Types

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'staff' | 'manager' | 'owner' | 'admin';

export interface StoreJoinRequest {
    id: string;
    user_id: string;
    store_id: string;
    branch_id: string;
    requested_role: UserRole;
    status: JoinRequestStatus;
    approved_by?: string;
    created_at: string;
    updated_at: string;
}

export interface StoreMember {
    id: string;
    user_id: string;
    store_id: string;
    branch_id: string;
    role: UserRole;
    joined_at: string;
}

export type NotificationType =
    | 'JOIN_REQUEST'
    | 'JOIN_APPROVED'
    | 'JOIN_REJECTED';

export interface BaseNotification {
    id: string;
    type: NotificationType;
    created_at: number;
    read: boolean;
}

export interface JoinRequestNotification extends BaseNotification {
    type: 'JOIN_REQUEST';
    request_id: string;
    store_id: string;
    store_name: string;
    branch_id: string;
    branch_name: string;
    requested_role: UserRole;
    from_user_id: string;
    from_user_name: string;
}

export interface JoinResponseNotification extends BaseNotification {
    type: 'JOIN_APPROVED' | 'JOIN_REJECTED';
    request_id: string;
    store_id: string;
    store_name: string;
    branch_id: string;
    branch_name: string;
    role?: UserRole;
    message?: string;
}

export type Notification = JoinRequestNotification | JoinResponseNotification;

