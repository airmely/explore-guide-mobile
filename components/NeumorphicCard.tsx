import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

interface NeumorphicCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
    borderRadius?: number;
    elevation?: number;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
    children,
    style,
    padding,
    borderRadius,
    elevation = 8,
}) => {
    const { theme } = useTheme();

    const cardStyle = {
        backgroundColor: theme.colors.card,
        borderRadius: borderRadius || theme.borderRadius.md,
        padding: padding || theme.spacing.md,
        shadowColor: theme.colors.shadow,
        shadowOffset: {
            width: 0,
            height: elevation / 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: elevation,
        elevation: elevation,
    };

    return (
        <View style={[styles.container, cardStyle, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
}); 