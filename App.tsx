import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { AuthScreen } from './screens/AuthScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import AddProductScreen from './screens/AddProductScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FeedScreen from './screens/FeedScreen';
import TrackedProductsScreen from './screens/TrackedProductsScreen';
import { Ionicons } from '@expo/vector-icons';
import apiClient from './services/api';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Добавить') iconName = 'add-circle';
          if (route.name === 'Отслеживаемые') iconName = 'trending-up';
          if (route.name === 'Избранное') iconName = 'star';
          if (route.name === 'Лента') iconName = 'list';
          if (route.name === 'Настройки') iconName = 'settings';

          return (
            <Ionicons
              name={iconName}
              size={focused ? size + 2 : size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          textTransform: 'uppercase',
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 4,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: '700',
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen
        name="Добавить"
        component={AddProductScreen}
        options={{
          title: '✨ Добавить товар',
        }}
      />
      <Tab.Screen
        name="Отслеживаемые"
        component={TrackedProductsScreen}
        options={{
          title: '📈 Отслеживаемые',
        }}
      />
      <Tab.Screen
        name="Избранное"
        component={FavoritesScreen}
        options={{
          title: '⭐ Избранное',
        }}
      />
      <Tab.Screen
        name="Лента"
        component={FeedScreen}
        options={{
          title: '📋 Рекомендации',
        }}
      />
      <Tab.Screen
        name="Настройки"
        component={SettingsScreen}
        options={{
          title: '⚙️ Настройки',
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // При выходе из приложения - логаут
        handleLogout();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      // Token уже сохранен в apiClient после успешной верификации OTP
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Error during auth success:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  if (isLoading) {
    return null; // Можно добавить splash screen
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.name === 'dark',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
      }}
    >
      <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth">
            {() => <AuthScreen onAuthSuccess={handleAuthSuccess} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
