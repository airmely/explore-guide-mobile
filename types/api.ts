// Auth Types
export interface SendOtpRequest {
    phone_number: string;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
    expires_in: number;
    demo_code?: string;
}

export interface VerifyOtpRequest {
    phone_number: string;
    code: string;
}

export interface VerifyOtpResponse {
    success: boolean;
    message: string;
    phone_number: string;
    access_token: string;
    refresh_token: string;
    user_id: number;
    is_new_user: boolean;
}

// Product Types
export interface Category {
    id: number;
    name: string;
    icon?: string;
}

export interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

export interface User {
    id: number;
    email: string;
    phone_number?: string;
    is_active: boolean;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: Category;
    seller: User;
    images: ProductImage[];
    condition: 'new' | 'used' | 'refurbished';
    tags?: string[];
    city?: string;
    country?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductsListResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ProductCreate {
    name: string;
    description?: string;
    price: number;
    category_id: number;
    condition: 'new' | 'used' | 'refurbished';
    tags?: string[];
    city?: string;
    country?: string;
    images?: Array<{ url: string; is_primary: boolean }>;
}

// Favorites Types
export interface Favorite {
    id: number;
    user_id: number;
    product_id: number;
    product: Product;
    created_at: string;
}

export interface FavoritesListResponse {
    favorites: Favorite[];
    total: number;
}

export interface FavoriteCreate {
    product_id: number;
}

// Error Types
export interface ApiError {
    detail: string;
} 