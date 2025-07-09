import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';
import {
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    ProductsListResponse,
    Product,
    ProductCreate,
    FavoritesListResponse,
    FavoriteCreate,
    Favorite,
    Category,
    ApiError,
} from '../types/api';

class ApiClient {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = `${config.API_BASE_URL}/api/v1`;
        this.loadToken();
    }

    private async loadToken() {
        try {
            this.token = await AsyncStorage.getItem('authToken');
        } catch (error) {
            console.error('Error loading token:', error);
        }
    }

    private async saveToken(token: string) {
        try {
            await AsyncStorage.setItem('authToken', token);
            this.token = token;
        } catch (error) {
            console.error('Error saving token:', error);
        }
    }

    private async removeToken() {
        try {
            await AsyncStorage.removeItem('authToken');
            this.token = null;
        } catch (error) {
            console.error('Error removing token:', error);
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                const error: ApiError = data;
                throw new Error(error.detail || 'Ошибка API');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Auth methods
    async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
        const data: SendOtpRequest = { phone_number: phoneNumber };
        return this.request<SendOtpResponse>('/otp/send-code', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verifyOtp(phoneNumber: string, code: string): Promise<VerifyOtpResponse> {
        const data: VerifyOtpRequest = { phone_number: phoneNumber, code };
        const response = await this.request<VerifyOtpResponse>('/otp/verify-code', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        // Save token for future requests
        if (response.access_token) {
            await this.saveToken(response.access_token);
        }

        return response;
    }

    async logout(): Promise<void> {
        await this.removeToken();
    }

    // Products methods
    async getProducts(params: {
        page?: number;
        limit?: number;
        category_id?: number;
        search?: string;
        min_price?: number;
        max_price?: number;
    } = {}): Promise<ProductsListResponse> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

        return this.request<ProductsListResponse>(endpoint);
    }

    async getProduct(id: number): Promise<Product> {
        return this.request<Product>(`/products/${id}`);
    }

    async createProduct(productData: ProductCreate): Promise<Product> {
        return this.request<Product>('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    async updateProduct(id: number, productData: Partial<ProductCreate>): Promise<Product> {
        return this.request<Product>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    }

    async deleteProduct(id: number): Promise<void> {
        return this.request<void>(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    async getCategories(): Promise<Category[]> {
        return this.request<Category[]>('/products/categories/list');
    }

    // Favorites methods
    async getFavorites(): Promise<FavoritesListResponse> {
        return this.request<FavoritesListResponse>('/favorites');
    }

    async addToFavorites(productId: number): Promise<Favorite> {
        const data: FavoriteCreate = { product_id: productId };
        return this.request<Favorite>('/favorites', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async removeFromFavorites(productId: number): Promise<void> {
        return this.request<void>(`/favorites/${productId}`, {
            method: 'DELETE',
        });
    }

    async checkFavorite(productId: number): Promise<{ is_favorite: boolean; favorite_id?: number }> {
        return this.request<{ is_favorite: boolean; favorite_id?: number }>(`/favorites/check/${productId}`);
    }
}

export default new ApiClient(); 