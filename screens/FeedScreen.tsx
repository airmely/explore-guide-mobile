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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeProvider';
import { ProductCard } from '../components/ProductCard';
import { FilterBar, categoryFilters, conditionFilters, shippingFilters } from '../components/FilterBar';
import { AdBanner } from '../components/AdBanner';
import apiClient from '../services/api';
import { Product as ApiProduct, Category } from '../types/api';

interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  store: string;
  condition: 'new' | 'used';
  shipping: string;
  category: string;
  isTracked: boolean;
  isFavorite: boolean;
}

// Моковые данные для демонстрации
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=iPhone+15',
    currentPrice: 129990,
    originalPrice: 149990,
    store: 'Apple Store',
    condition: 'new',
    shipping: 'Бесплатная доставка',
    category: 'electronics',
    isTracked: false,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'MacBook Air M2 13" 256GB',
    image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=MacBook+Air',
    currentPrice: 99990,
    originalPrice: 119990,
    store: 'М.Видео',
    condition: 'new',
    shipping: 'Доставка 500₽',
    category: 'electronics',
    isTracked: true,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Nike+Air+Max',
    currentPrice: 8990,
    originalPrice: 12990,
    store: 'Nike',
    condition: 'new',
    shipping: 'Бесплатная доставка',
    category: 'sports',
    isTracked: false,
    isFavorite: false,
  },
];

// Helper function to convert API product to local format
const convertApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id.toString(),
  name: apiProduct.name,
  image: apiProduct.images?.[0]?.url || 'https://via.placeholder.com/300x200/6366f1/ffffff?text=No+Image',
  currentPrice: apiProduct.price,
  originalPrice: apiProduct.price * 1.2, // Mock original price for demo
  store: apiProduct.seller.email,
  condition: apiProduct.condition,
  shipping: 'Бесплатная доставка', // Mock shipping
  category: apiProduct.category.name.toLowerCase(),
  isTracked: false, // Will be loaded separately
  isFavorite: false, // Will be loaded separately
});

const FeedScreen = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await apiClient.getProducts({ page: 1, limit: 20 });
      const convertedProducts = response.products.map(convertApiProduct);
      setProducts(convertedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to mock data if API fails
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductPress = (product: Product) => {
    Alert.alert('Товар', `Открыть детали ${product.name}`);
  };

  const handleTrackProduct = (product: Product) => {
    const updatedProducts = products.map(p =>
      p.id === product.id ? { ...p, isTracked: !p.isTracked } : p
    );
    setProducts(updatedProducts);
  };

  const handleFavoriteProduct = (product: Product) => {
    const updatedProducts = products.map(p =>
      p.id === product.id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setProducts(updatedProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Фильтрация по состоянию
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(product =>
        selectedConditions.includes(product.condition)
      );
    }

    // Фильтрация по доставке
    if (selectedShipping.length > 0) {
      filtered = filtered.filter(product => {
        if (selectedShipping.includes('free') && product.shipping.includes('Бесплатная')) return true;
        if (selectedShipping.includes('paid') && product.shipping.includes('Доставка')) return true;
        if (selectedShipping.includes('pickup') && product.shipping.includes('Самовывоз')) return true;
        return false;
      });
    }

    // Фильтрация по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.store.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [selectedCategories, selectedConditions, selectedShipping, searchQuery, products]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onTrack={handleTrackProduct}
      onFavorite={handleFavoriteProduct}
    />
  );

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
      <Ionicons name="search" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Товары не найдены
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Попробуйте изменить фильтры или поисковый запрос
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
          Загрузка товаров...
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
            placeholder="Поиск товаров..."
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

      <FilterBar
        filters={conditionFilters}
        selectedFilters={selectedConditions}
        onFilterChange={setSelectedConditions}
        title="Состояние"
      />

      <FilterBar
        filters={shippingFilters}
        selectedFilters={selectedShipping}
        onFilterChange={setSelectedShipping}
        title="Доставка"
      />

      {/* Рекламный баннер */}
      <AdBanner
        title="Премиум функции"
        subtitle="Отслеживайте неограниченное количество товаров"
        ctaText="Попробовать"
        variant="premium"
        onPress={() => Alert.alert('Премиум', 'Переход к премиум подписке')}
      />

      {/* Список товаров */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.productsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyList}
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

export default FeedScreen; 