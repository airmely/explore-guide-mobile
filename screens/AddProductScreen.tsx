import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeProvider';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { FilterBar, categoryFilters } from '../components/FilterBar';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  createdAt: string;
}

const AddProductScreen = () => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddProduct = async () => {
    if (!name.trim() || !selectedCategory || !price.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Ошибка', 'Введите корректную цену');
      return;
    }

    try {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: name.trim(),
        category: selectedCategory,
        price: priceValue,
        image: imageUrl.trim() || null,
        createdAt: new Date().toISOString(),
      };

      // Сохраняем в каталог
      const existingProducts = await AsyncStorage.getItem('catalogProducts');
      const products = existingProducts ? JSON.parse(existingProducts) : [];
      products.push(newProduct);
      await AsyncStorage.setItem('catalogProducts', JSON.stringify(products));

      Alert.alert('Успех', 'Товар добавлен в каталог', [
        {
          text: 'OK', onPress: () => {
            setName('');
            setSelectedCategory('');
            setPrice('');
            setImageUrl('');
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить товар');
    }
  };

  const inputStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  const buttonStyle = {
    backgroundColor: theme.colors.primary,
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NeumorphicCard>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            ✨ Добавить товар
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Добавьте товар в каталог для отслеживания цен
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Название товара *
              </Text>
              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Введите название товара..."
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Категория *
              </Text>
              <FilterBar
                filters={categoryFilters}
                selectedFilters={selectedCategory ? [selectedCategory] : []}
                onFilterChange={(filters) => setSelectedCategory(filters[0] || '')}
                multiSelect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Цена (₽) *
              </Text>
              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                URL изображения (необязательно)
              </Text>
              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor={theme.colors.textSecondary}
                value={imageUrl}
                onChangeText={setImageUrl}
                keyboardType="url"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, buttonStyle]}
              onPress={handleAddProduct}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.buttonText}>Добавить товар</Text>
            </TouchableOpacity>
          </View>
        </NeumorphicCard>

        <NeumorphicCard>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            💡 Советы
          </Text>
          <View style={styles.tips}>
            <View style={styles.tip}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Указывайте точное название товара для лучшего поиска
              </Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Добавляйте изображения для лучшего восприятия
              </Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                Указывайте актуальную цену для точного отслеживания
              </Text>
            </View>
          </View>
        </NeumorphicCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tips: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AddProductScreen; 