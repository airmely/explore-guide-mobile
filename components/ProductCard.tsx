import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeProvider';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  image: string;
  currentPrice?: number;
  originalPrice?: number;
  price?: number; // Для обратной совместимости
  store?: string;
  condition?: 'new' | 'used';
  shipping?: string;
  category: string;
  isTracked?: boolean;
  isFavorite?: boolean;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onTrack?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void; // Для обратной совместимости
  onRemove?: (id: string) => void; // Для обратной совместимости
  showActions?: boolean;
  showRemoveButton?: boolean; // Для обратной совместимости
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onTrack,
  onFavorite,
  onAddToFavorites,
  onRemove,
  showActions = true,
  showRemoveButton = false,
}) => {
  const { theme } = useTheme();

  // Обратная совместимость со старым интерфейсом
  const currentPrice = product.currentPrice ?? product.price ?? 0;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const isTracked = product.isTracked ?? false;
  const isFavorite = product.isFavorite ?? false;

  const priceDrop = originalPrice - currentPrice;
  const priceDropPercent = priceDrop > 0 ? ((priceDrop / originalPrice) * 100).toFixed(0) : '0';

  const cardStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  };

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  const handleTrack = () => {
    if (onTrack) {
      onTrack(product);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(product);
    } else if (onAddToFavorites) {
      onAddToFavorites(product);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(product.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, cardStyle]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/300x200/6366f1/ffffff?text=No+Image' }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />

        {priceDrop > 0 && (
          <View style={[styles.priceDropBadge, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.priceDropText}>-{priceDropPercent}%</Text>
          </View>
        )}

        {showActions && (
          <View style={styles.actionButtons}>
            {showRemoveButton ? (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.overlay }]}
                onPress={handleRemove}
              >
                <Ionicons name="trash" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.overlay }]}
                  onPress={handleFavorite}
                >
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite ? theme.colors.error : theme.colors.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.overlay }]}
                  onPress={handleTrack}
                >
                  <Ionicons
                    name={isTracked ? 'eye' : 'eye-outline'}
                    size={20}
                    color={isTracked ? theme.colors.primary : theme.colors.text}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: theme.colors.primary }]}>
            ₽{currentPrice.toLocaleString()}
          </Text>
          {priceDrop > 0 && (
            <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
              ₽{originalPrice.toLocaleString()}
            </Text>
          )}
        </View>

        <View style={styles.details}>
          {product.store && (
            <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>
                {product.store}
              </Text>
            </View>
          )}

          {product.condition && (
            <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>
                {product.condition === 'new' ? 'Новый' : 'Б/У'}
              </Text>
            </View>
          )}
        </View>

        {product.shipping && (
          <Text style={[styles.shipping, { color: theme.colors.textSecondary }]}>
            {product.shipping}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  priceDropBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceDropText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  details: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shipping: {
    fontSize: 12,
    fontStyle: 'italic',
  },
}); 