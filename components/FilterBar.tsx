import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeProvider';

export interface Filter {
    id: string;
    label: string;
    value: string;
}

interface FilterBarProps {
    filters: Filter[];
    selectedFilters: string[];
    onFilterChange: (filterIds: string[]) => void;
    title?: string;
    multiSelect?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    selectedFilters,
    onFilterChange,
    title,
    multiSelect = true,
}) => {
    const { theme } = useTheme();

    const handleFilterPress = (filterId: string) => {
        if (multiSelect) {
            const newFilters = selectedFilters.includes(filterId)
                ? selectedFilters.filter(id => id !== filterId)
                : [...selectedFilters, filterId];
            onFilterChange(newFilters);
        } else {
            onFilterChange([filterId]);
        }
    };

    const clearFilters = () => {
        onFilterChange([]);
    };

    return (
        <View style={styles.container}>
            {title && (
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                    {selectedFilters.length > 0 && (
                        <TouchableOpacity onPress={clearFilters}>
                            <Text style={[styles.clearText, { color: theme.colors.primary }]}>
                                Очистить
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filters.map((filter) => {
                    const isSelected = selectedFilters.includes(filter.id);

                    const filterStyle = {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    };

                    const textStyle = {
                        color: isSelected ? '#fff' : theme.colors.text,
                    };

                    return (
                        <TouchableOpacity
                            key={filter.id}
                            style={[styles.filterChip, filterStyle]}
                            onPress={() => handleFilterPress(filter.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, textStyle]}>{filter.label}</Text>
                            {isSelected && (
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

// Предустановленные фильтры
export const categoryFilters: Filter[] = [
    { id: 'electronics', label: 'Электроника', value: 'electronics' },
    { id: 'clothing', label: 'Одежда', value: 'clothing' },
    { id: 'home', label: 'Дом и сад', value: 'home' },
    { id: 'sports', label: 'Спорт', value: 'sports' },
    { id: 'books', label: 'Книги', value: 'books' },
    { id: 'automotive', label: 'Авто', value: 'automotive' },
    { id: 'beauty', label: 'Красота', value: 'beauty' },
    { id: 'toys', label: 'Игрушки', value: 'toys' },
];

export const conditionFilters: Filter[] = [
    { id: 'new', label: 'Новый', value: 'new' },
    { id: 'used', label: 'Б/У', value: 'used' },
    { id: 'refurbished', label: 'Восстановленный', value: 'refurbished' },
];

export const shippingFilters: Filter[] = [
    { id: 'free', label: 'Бесплатно', value: 'free' },
    { id: 'paid', label: 'Платная', value: 'paid' },
    { id: 'pickup', label: 'Самовывоз', value: 'pickup' },
];

export const priceRangeFilters: Filter[] = [
    { id: '0-1000', label: 'До 1000₽', value: '0-1000' },
    { id: '1000-5000', label: '1000-5000₽', value: '1000-5000' },
    { id: '5000-10000', label: '5000-10000₽', value: '5000-10000' },
    { id: '10000+', label: 'От 10000₽', value: '10000+' },
];

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    clearText: {
        fontSize: 14,
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
    },
}); 