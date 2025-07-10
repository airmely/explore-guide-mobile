import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeProvider';
import { Category } from '../types/api';

interface CategoryFilterProps {
    categories: Category[];
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategories,
    onCategoryChange,
}) => {
    const { theme } = useTheme();

    const handleCategoryToggle = (categoryName: string) => {
        const newSelected = selectedCategories.includes(categoryName)
            ? selectedCategories.filter(cat => cat !== categoryName)
            : [...selectedCategories, categoryName];
        onCategoryChange(newSelected);
    };

    const isSelected = (categoryName: string) => selectedCategories.includes(categoryName);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                Категории
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            {
                                backgroundColor: isSelected(category.name)
                                    ? theme.colors.primary
                                    : theme.colors.surface,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        onPress={() => handleCategoryToggle(category.name)}
                    >
                        {category.icon && (
                            <Ionicons
                                name={category.icon as any}
                                size={16}
                                color={isSelected(category.name) ? theme.colors.onPrimary : theme.colors.text}
                                style={styles.icon}
                            />
                        )}
                        <Text
                            style={[
                                styles.categoryText,
                                {
                                    color: isSelected(category.name) ? theme.colors.onPrimary : theme.colors.text,
                                },
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        minHeight: 36,
    },
    icon: {
        marginRight: 4,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
}); 