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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  createdAt: string;
}

const TrackedProductsScreen = () => {
  const { theme } = useTheme();
  const [trackedProducts, setTrackedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadTrackedProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('trackedProducts');
      if (storedProducts) {
        setTrackedProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить отслеживаемые товары');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrackedProducts();
    setRefreshing(false);
  };

  const handleRemoveFromTracking = async (id: string) => {
    try {
      const updatedProducts = trackedProducts.filter(product => product.id !== id);
      setTrackedProducts(updatedProducts);
      await AsyncStorage.setItem('trackedProducts', JSON.stringify(updatedProducts));
      Alert.alert('Успех', 'Товар удален из отслеживания');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить товар');
    }
  };

  const filterProducts = () => {
    let filtered = trackedProducts;

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

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadTrackedProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategories, searchQuery, trackedProducts]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onRemove={handleRemoveFromTracking}
      showRemoveButton={true}
    />
  );

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.colors.card }]}>
      <Ionicons name="eye-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {searchQuery.trim() || selectedCategories.length > 0
          ? 'Отслеживаемые товары не найдены'
          : 'Нет отслеживаемых товаров'
        }
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {searchQuery.trim() || selectedCategories.length > 0
          ? 'Попробуйте изменить фильтры или поисковый запрос'
          : 'Добавьте товары для отслеживания цен'
        }
      </Text>
    </View>
  );

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Поиск */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder="Поиск отслеживаемых товаров..."
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

      {/* Список отслеживаемых товаров */}
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

export default TrackedProductsScreen; 