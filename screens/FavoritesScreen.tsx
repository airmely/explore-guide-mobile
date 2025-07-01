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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PremiumBackground } from '../components/PremiumBackground';
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

const FavoritesScreen = () => {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

    setFilteredFavorites(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterFavorites();
  }, [selectedCategory, searchQuery, favoriteProducts]);

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
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Каталог пуст</Text>
      <Text style={styles.emptySubtitle}>
        Добавьте товары в каталог, чтобы они появились здесь
      </Text>
    </View>
  );

  const renderEmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery.trim() || selectedCategory !== 'all' 
          ? 'Избранные товары не найдены' 
          : 'Нет избранных товаров'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim() || selectedCategory !== 'all'
          ? 'Попробуйте изменить фильтры или поисковый запрос'
          : 'Добавьте товары из каталога в избранное'
        }
      </Text>
    </View>
  );

  return (
    <PremiumBackground>
      <View style={styles.container}>
        <Text style={styles.title}>⭐ Избранные товары</Text>
        
        {/* Поиск */}
        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск в избранном..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        </View>

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
        
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteProduct}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyFavorites}
        />

        {catalogProducts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📦 Товары из каталога</Text>
            <FlatList
              data={catalogProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderCatalogProduct}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyCatalog}
              scrollEnabled={false}
            />
          </>
        )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 30,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default FavoritesScreen; 