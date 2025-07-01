import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { GlassCard } from './GlassCard';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onRemove?: (id: string) => void;
  onAddToFavorites?: (product: Product) => void;
  showRemoveButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRemove,
  onAddToFavorites,
  showRemoveButton = false,
}) => {
  const handleRemove = () => {
    Alert.alert(
      'Удалить товар',
      'Вы уверены, что хотите удалить этот товар из избранного?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => onRemove?.(product.id) },
      ]
    );
  };

  const handleAddToFavorites = () => {
    onAddToFavorites?.(product);
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'Цена не указана';
    }
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>📦</Text>
          </View>
        )}
        
        {/* Бейдж категории */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{product.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Цена:</Text>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
        </View>
        
        <View style={styles.actions}>
          {showRemoveButton ? (
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
              <Text style={styles.removeButtonIcon}>🗑️</Text>
              <Text style={styles.removeButtonText}>Удалить</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={handleAddToFavorites}>
              <Text style={styles.addButtonIcon}>⭐</Text>
              <Text style={styles.addButtonText}>В избранное</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
    fontWeight: '500',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.5)',
  },
  removeButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 