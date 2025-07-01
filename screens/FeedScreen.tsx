import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PremiumBackground } from '../components/PremiumBackground';
import { GlassCard } from '../components/GlassCard';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  createdAt: string;
}

const categories = [
  { id: 'all', name: 'Все', icon: '📦' },
  { id: 'electronics', name: 'Электроника', icon: '📱' },
  { id: 'clothing', name: 'Одежда', icon: '👕' },
  { id: 'home', name: 'Дом и сад', icon: '🏠' },
  { id: 'sports', name: 'Спорт', icon: '⚽' },
  { id: 'books', name: 'Книги', icon: '📚' },
  { id: 'toys', name: 'Игрушки', icon: '🎮' },
  { id: 'other', name: 'Другое', icon: '📌' },
];

const FeedScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('catalogProducts');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить товары');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleAddToFavorites = async (product: Product) => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favoriteProducts');
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      
      const isAlreadyFavorite = favorites.some((fav: Product) => fav.id === product.id);
      
      if (isAlreadyFavorite) {
        Alert.alert('Информация', 'Товар уже в избранном');
        return;
      }

      favorites.push(product);
      await AsyncStorage.setItem('favoriteProducts', JSON.stringify(favorites));
      Alert.alert('Успех', 'Товар добавлен в избранное');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить в избранное');
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Фильтрация по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onAddToFavorites={handleAddToFavorites}
      showRemoveButton={false}
    />
  );

  const renderEmptyList = () => (
    <GlassCard style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>
        {searchQuery.trim() || selectedCategory !== 'all' 
          ? 'Товары не найдены' 
          : 'Нет товаров в каталоге'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim() || selectedCategory !== 'all'
          ? 'Попробуйте изменить фильтры или поисковый запрос'
          : 'Добавьте товары в каталог, чтобы они появились здесь'
        }
      </Text>
    </GlassCard>
  );

  return (
    <PremiumBackground>
      <View style={styles.container}>
        <Text style={styles.title}>📋 Рекомендации</Text>
        
        {/* Поиск */}
        <GlassCard style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        </GlassCard>

        {/* Категории */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Список товаров */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </PremiumBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchCard: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    paddingHorizontal: 4,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    fontWeight: '700',
  },
  productsList: {
    paddingBottom: 20,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default FeedScreen; 