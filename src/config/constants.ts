// Application-wide constants for Kirana Fintech App

export const APP_NAME = 'Kirana Fintech';
export const APP_DESCRIPTION = 'Financial management for local stores in Nepal';

// Currency
export const CURRENCY = 'NPR';
export const CURRENCY_SYMBOL = 'रू'; // Nepali Rupee symbol
export const CURRENCY_NAME = 'Nepali Rupee';

// Date and Time formats (Nepal timezone: UTC+5:45)
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const DISPLAY_DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';

// Transaction types
export const TRANSACTION_TYPES = {
    SALE: 'sale',
    PURCHASE: 'purchase',
    EXPENSE: 'expense',
    CREDIT: 'credit',
    PAYMENT: 'payment',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
    CASH: 'cash',
    DIGITAL: 'digital',
    CREDIT: 'credit',
} as const;

// User roles
export const USER_ROLES = {
    OWNER: 'owner',
    STAFF: 'staff',
    ADMIN: 'admin',
} as const;

// Store status
export const STORE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
} as const;

// Validation constants
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 128,
    PHONE_REGEX: /^(97|98)\d{8}$/, // Nepal phone number format
    PAN_REGEX: /^\d{9}$/, // Nepal PAN format (9 digits)
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

// Nepal-specific data
export const NEPAL_PROVINCES = [
    'Province No. 1',
    'Madhesh Province',
    'Bagmati Province',
    'Gandaki Province',
    'Lumbini Province',
    'Karnali Province',
    'Sudurpashchim Province',
] as const;
