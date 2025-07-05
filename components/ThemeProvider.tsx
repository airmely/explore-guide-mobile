import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
    name: 'dark' | 'light';
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        card: string;
        text: string;
        textSecondary: string;
        border: string;
        success: string;
        warning: string;
        error: string;
        overlay: string;
        shadow: string;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
}

const darkTheme: Theme = {
    name: 'dark',
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f0f23',
        surface: '#1a1a2e',
        card: '#16213e',
        text: '#ffffff',
        textSecondary: '#a1a1aa',
        border: '#27272a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        overlay: 'rgba(0, 0, 0, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
};

const lightTheme: Theme = {
    name: 'light',
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#f8fafc',
        surface: '#ffffff',
        card: '#ffffff',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        overlay: 'rgba(0, 0, 0, 0.5)',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
};

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(darkTheme);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme === 'light') {
                setThemeState(lightTheme);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const setTheme = async (themeName: 'dark' | 'light') => {
        const newTheme = themeName === 'dark' ? darkTheme : lightTheme;
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('theme', themeName);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const toggleTheme = () => {
        setTheme(theme.name === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}; 