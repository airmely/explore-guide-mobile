interface AppConfig {
    API_BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

const config: AppConfig = {
    API_BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com',
    NODE_ENV: __DEV__ ? 'development' : 'production',
};

export default config; 