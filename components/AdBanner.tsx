import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeProvider';

const { width } = Dimensions.get('window');

interface AdBannerProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    onPress?: () => void;
    variant?: 'premium' | 'standard';
}

export const AdBanner: React.FC<AdBannerProps> = ({
    title = 'Премиум функции',
    subtitle = 'Получите неограниченное отслеживание',
    ctaText = 'Попробовать',
    onPress,
    variant = 'standard',
}) => {
    const { theme } = useTheme();

    const gradientColors = variant === 'premium'
        ? [theme.colors.secondary, theme.colors.primary]
        : [theme.colors.surface, theme.colors.card];

    const bannerStyle = {
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    };

    return (
        <TouchableOpacity
            style={[styles.container, bannerStyle]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={gradientColors}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            {variant === 'premium' && (
                                <Ionicons name="diamond" size={20} color="#fff" />
                            )}
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>

                    <View style={styles.ctaContainer}>
                        <Text style={styles.ctaText}>{ctaText}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </View>
                </View>

                {variant === 'premium' && (
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        marginVertical: 12,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        padding: 20,
        position: 'relative',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    ctaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    ctaText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    premiumBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
}); 