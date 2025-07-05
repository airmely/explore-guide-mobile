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

const FavoritesScreen = () => {
  const { theme } = useTheme();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      // Загружаем товары из каталога
      const storedCatalog = await AsyncStorage.getItem('catalogProducts');
      if (storedCatalog) {
        setCatalogProducts(JSON.parse(storedCatalog));
      }

      // Загружаем избранные товары
      const storedFavorites = await AsyncStorage.getItem('favoriteProducts');
      if (storedFavorites) {
        setFavoriteProducts(JSON.parse(storedFavorites));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
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

      const updatedFavorites = [...favoriteProducts, product];
      setFavoriteProducts(updatedFavorites);
      await AsyncStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));

      Alert.alert('Успех', 'Товар добавлен в избранное');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить в избранное');
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      const updatedFavorites = favoriteProducts.filter(product => product.id !== id);
      setFavoriteProducts(updatedFavorites);
      await AsyncStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
      Alert.alert('Успех', 'Товар удален из избранного');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить товар');
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