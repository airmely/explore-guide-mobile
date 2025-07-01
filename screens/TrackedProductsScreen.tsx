import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PremiumBackground } from '../components/PremiumBackground';
import { GlassCard } from '../components/GlassCard';

interface TrackedProduct {
  id: string;
  name: string;
  category: string;
  targetPrice: number;
  currentPrice?: number;
  createdAt: string;
}

const TrackedProductsScreen = () => {
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const loadTrackedProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('trackedProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить отслеживаемые товары');
    }
  };

  const addTrackedProduct = async () => {
    if (!name || !category || !targetPrice) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      const newProduct: TrackedProduct = {
        id: Date.now().toString(),
        name,
        category,
        targetPrice: parseFloat(targetPrice),
        createdAt: new Date().toISOString(),
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      await AsyncStorage.setItem('trackedProducts', JSON.stringify(updatedProducts));
      
      Alert.alert('Успех', 'Товар добавлен в отслеживаемые');
      setName('');
      setCategory('');
      setTargetPrice('');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить товар');
    }
  };

  const removeTrackedProduct = async (id: string) => {
    try {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      await AsyncStorage.setItem('trackedProducts', JSON.stringify(updatedProducts));
      Alert.alert('Успех', 'Товар удален из отслеживаемых');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить товар');
    }
  };

  useEffect(() => {
    loadTrackedProducts();
  }, []);

  const renderTrackedProduct = ({ item }: { item: TrackedProduct }) => (
    <GlassCard style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => removeTrackedProduct(item.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.productCategory}>{item.category}</Text>
      
      <View style={styles.priceContainer}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Целевая цена:</Text>
          <Text style={styles.targetPrice}>{item.targetPrice.toLocaleString('ru-RU')} ₽</Text>
        </View>
        
        {item.currentPrice && (
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Текущая цена:</Text>
            <Text style={[
              styles.currentPrice,
              { color: item.currentPrice <= item.targetPrice ? '#4CAF50' : '#FF5722' }
            ]}>
              {item.currentPrice.toLocaleString('ru-RU')} ₽
            </Text>
          </View>
        )}
      </View>
    </GlassCard>
  );

  return (
    <PremiumBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.addCard}>
          <Text style={styles.title}>📈 Добавить для отслеживания</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Название товара</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите название..."
              value={name}
              onChangeText={setName}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Категория</Text>
            <TextInput
              style={styles.input}
              placeholder="Например: Электроника, Одежда..."
              value={category}
              onChangeText={setCategory}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Целевая цена (₽)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={targetPrice}
              onChangeText={setTargetPrice}
              keyboardType="numeric"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={addTrackedProduct}>
            <Text style={styles.buttonIcon}>📈</Text>
            <Text style={styles.buttonText}>Добавить для отслеживания</Text>
          </TouchableOpacity>
        </GlassCard>

        <Text style={styles.sectionTitle}>Отслеживаемые товары</Text>
        
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderTrackedProduct}
          scrollEnabled={false}
          ListEmptyComponent={
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Нет отслеживаемых товаров</Text>
              <Text style={styles.emptySubtitle}>
                Добавьте товары для отслеживания цен
              </Text>
            </GlassCard>
          }
        />
      </ScrollView>
    </PremiumBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addCard: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productCard: {
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  removeButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.5)',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '500',
  },
  priceContainer: {
    gap: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  targetPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  },
});

export default TrackedProductsScreen; 