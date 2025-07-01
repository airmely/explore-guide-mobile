import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddProductScreen from './screens/AddProductScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FeedScreen from './screens/FeedScreen';
import TrackedProductsScreen from './screens/TrackedProductsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'Добавить') iconName = 'add-circle';
            if (route.name === 'Отслеживаемые') iconName = 'trending-up';
            if (route.name === 'Избранное') iconName = 'star';
            if (route.name === 'Лента') iconName = 'list';
            
            return (
              <Ionicons 
                name={iconName} 
                size={focused ? size + 2 : size} 
                color={color} 
              />
            );
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'hsla(0, 0.00%, 100.00%, 0.60)',
          tabBarStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 20,
            paddingTop: 10,
            shadowColor: '#000',
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 4,
          },
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '700',
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1,
          },
          headerTintColor: '#fff',
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
