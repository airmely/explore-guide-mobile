import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeProvider';
import { ProductCard } from '../components/ProductCard';
import { FilterBar, categoryFilters } from '../components/FilterBar';
import apiClient from '../services/api';
import { Favorite, Product as ApiProduct } from '../types/api';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  createdAt: string;
}

// Helper function to convert API product to local format
const convertApiProductToLocal = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id.toString(),
  name: apiProduct.name,
  category: apiProduct.category.name.toLowerCase(),
  price: apiProduct.price,
  image: apiProduct.images?.[0]?.url || null,
  createdAt: apiProduct.created_at,
});

const FavoritesScreen = () => {
  const { theme } = useTheme();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Загружаем избранные товары из API
      const favoritesResponse = await apiClient.getFavorites();
      const convertedFavorites = favoritesResponse.favorites.map(fav =>
        convertApiProductToLocal(fav.product)
      );
      setFavoriteProducts(convertedFavorites);

      // Загружаем товары из каталога (для демонстрации)
      const productsResponse = await apiClient.getProducts({ page: 1, limit: 10 });
      const convertedProducts = productsResponse.products.map(convertApiProductToLocal);
      setCatalogProducts(convertedProducts);

    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddToFavorites = async (product: Product) => {
    try {
      const isAlreadyFavorite = favoriteProducts.some(fav => fav.id === product.id);

      if (isAlreadyFavorite) {
        Alert.alert('Информация', 'Товар уже в избранном');
        return;
      }

      await apiClient.addToFavorites(parseInt(product.id));
      
      const updatedFavorites = [...favoriteProducts, product];
      setFavoriteProducts(updatedFavorites);

      Alert.alert('Успех', 'Товар добавлен в избранное');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось добавить в избранное';
      Alert.alert('Ошибка', errorMessage);
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      await apiClient.removeFromFavorites(parseInt(id));
      
      const updatedFavorites = favoriteProducts.filter(product => product.id !== id);
      setFavoriteProducts(updatedFavorites);
      
      Alert.alert('Успех', 'Товар удален из избранного');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось удалить товар';
      Alert.alert('Ошибка', errorMessage);
    }
  };

  const filterFavorites = () => {
    let filtered = favoriteProducts;

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Фильтрация по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFavorites(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterFavorites();
  }, [selectedCategories, searchQuery, favoriteProducts]);

  const renderCatalogProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onAddToFavorites={handleAddToFavorites}
      showRemoveButton={false}
    />
  );

  const renderFavoriteProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onRemove={handleRemoveFromFavorites}
      showRemoveButton={true}
    />
  );

  const renderEmptyCatalog = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
      <Ionicons name="heart-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Каталог пуст</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Добавьте товары в каталог, чтобы они появились здесь
      </Text>
    </View>
  );

  const renderEmptyFavorites = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
      <Ionicons name="heart" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {searchQuery.trim() || selectedCategories.length > 0
          ? 'Избранные товары не найдены'
          : 'Нет избранных товаров'
        }
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {searchQuery.trim() || selectedCategories.length > 0
          ? 'Попробуйте изменить фильтры или поисковый запрос'
          : 'Добавьте товары из каталога в избранное'
        }
      </Text>
    </View>
  );

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="hourglass" size={64} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Загрузка избранного...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Поиск */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder="Поиск в избранном..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Фильтры */}
      <FilterBar
        filters={categoryFilters}
        selectedFilters={selectedCategories}
        onFilterChange={setSelectedCategories}
        title="Категории"
      />

      {/* Список избранных товаров */}
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteProduct}
        contentContainerStyle={styles.productsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyFavorites}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  productsList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    margin: 16,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen; 