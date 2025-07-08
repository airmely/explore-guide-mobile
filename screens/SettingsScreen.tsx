import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeProvider';
import { NeumorphicCard } from '../components/NeumorphicCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [pushNotifications, setPushNotifications] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    // const [autoSessionClear, setAutoSessionClear] = useState(true);

    // useEffect(() => {
    //     // Load auto session clear flag from storage
    //     (async () => {
    //         try {
    //             const value = await AsyncStorage.getItem('autoSessionClear');
    //             if (value !== null) setAutoSessionClear(value === 'true');
    //         } catch (e) {
    //             console.log('Error loading autoSessionClear:', e);
    //         }
    //     })();
    // }, []);

    // const handleAutoSessionClearChange = async (value: boolean) => {
    //     setAutoSessionClear(value);
    //     try {
    //         await AsyncStorage.setItem('autoSessionClear', value.toString());
    //     } catch (e) {
    //         console.log('Error saving autoSessionClear:', e);
    //     }
    // };

    const handleLogout = () => {
        Alert.alert(
            'Выход',
            'Вы уверены, что хотите выйти из аккаунта?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('authToken');
                            // Здесь можно добавить навигацию к экрану аутентификации
                            console.log('Logout successful');
                        } catch (error) {
                            console.log('Error during logout:', error);
                        }
                    }
                },
            ]
        );
    };

    const handleUpgradeToPremium = () => {
        Alert.alert(
            'Премиум подписка',
            'Получите неограниченное количество отслеживаемых товаров и дополнительные функции!',
            [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Подписаться', onPress: () => setIsPremium(true) },
            ]
        );
    };

    const SettingItem: React.FC<{
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        rightComponent?: React.ReactNode;
        showArrow?: boolean;
    }> = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
        <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                    <Ionicons name={icon} size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.settingItemContent}>
                    <Text style={[styles.settingItemTitle, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.settingItemSubtitle, { color: theme.colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.settingItemRight}>
                {rightComponent}
                {showArrow && onPress && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Настройки</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                    Управляйте приложением
                </Text>
            </View>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Профиль</Text>

                <SettingItem
                    icon="person"
                    title="Изменить профиль"
                    subtitle="Имя, аватар, контакты"
                    onPress={() => console.log('Edit profile')}
                />

                <SettingItem
                    icon="shield-checkmark"
                    title="Безопасность"
                    subtitle="Пароль, двухфакторная аутентификация"
                    onPress={() => console.log('Security')}
                />

                <SettingItem
                    icon="card"
                    title="Платежные методы"
                    subtitle="Карты, кошельки"
                    onPress={() => console.log('Payment methods')}
                />
            </NeumorphicCard>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Уведомления</Text>

                <SettingItem
                    icon="notifications"
                    title="Push-уведомления"
                    rightComponent={
                        <Switch
                            value={pushNotifications}
                            onValueChange={setPushNotifications}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor={pushNotifications ? '#fff' : theme.colors.textSecondary}
                        />
                    }
                    showArrow={false}
                />

                <SettingItem
                    icon="trending-down"
                    title="Уведомления о снижении цен"
                    rightComponent={
                        <Switch
                            value={priceAlerts}
                            onValueChange={setPriceAlerts}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor={priceAlerts ? '#fff' : theme.colors.textSecondary}
                        />
                    }
                    showArrow={false}
                />

                <SettingItem
                    icon="mail"
                    title="Email уведомления"
                    rightComponent={
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor={emailNotifications ? '#fff' : theme.colors.textSecondary}
                        />
                    }
                    showArrow={false}
                />
            </NeumorphicCard>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Внешний вид</Text>

                <SettingItem
                    icon="moon"
                    title="Темная тема"
                    subtitle={theme.name === 'dark' ? 'Включена' : 'Выключена'}
                    rightComponent={
                        <Switch
                            value={theme.name === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            thumbColor={theme.name === 'dark' ? '#fff' : theme.colors.textSecondary}
                        />
                    }
                    showArrow={false}
                />

                <SettingItem
                    icon="language"
                    title="Язык"
                    subtitle="Русский"
                    onPress={() => console.log('Language')}
                />
            </NeumorphicCard>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Подписка</Text>

                {isPremium ? (
                    <SettingItem
                        icon="diamond"
                        title="Премиум активна"
                        subtitle="Неограниченное отслеживание"
                        rightComponent={
                            <View style={[styles.premiumBadge, { backgroundColor: theme.colors.success }]}>
                                <Text style={styles.premiumBadgeText}>АКТИВНА</Text>
                            </View>
                        }
                        showArrow={false}
                    />
                ) : (
                    <SettingItem
                        icon="diamond-outline"
                        title="Премиум подписка"
                        subtitle="3 товара из 5 отслеживается"
                        onPress={handleUpgradeToPremium}
                        rightComponent={
                            <View style={[styles.premiumBadge, { backgroundColor: theme.colors.warning }]}>
                                <Text style={styles.premiumBadgeText}>3/5</Text>
                            </View>
                        }
                    />
                )}
            </NeumorphicCard>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Поддержка</Text>

                <SettingItem
                    icon="help-circle"
                    title="Помощь"
                    subtitle="FAQ, инструкции"
                    onPress={() => console.log('Help')}
                />

                <SettingItem
                    icon="chatbubble"
                    title="Обратная связь"
                    subtitle="Сообщить о проблеме"
                    onPress={() => console.log('Feedback')}
                />

                <SettingItem
                    icon="document-text"
                    title="Условия использования"
                    onPress={() => console.log('Terms')}
                />

                <SettingItem
                    icon="shield"
                    title="Политика конфиденциальности"
                    onPress={() => console.log('Privacy')}
                />
            </NeumorphicCard>

            <NeumorphicCard>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>О приложении</Text>

                <SettingItem
                    icon="information-circle"
                    title="Версия"
                    subtitle="1.0.0"
                    showArrow={false}
                />

                <SettingItem
                    icon="star"
                    title="Оценить приложение"
                    onPress={() => console.log('Rate app')}
                />
            </NeumorphicCard>

            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
                onPress={handleLogout}
            >
                <Ionicons name="log-out" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingItemContent: {
        flex: 1,
    },
    settingItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingItemSubtitle: {
        fontSize: 14,
    },
    settingItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    premiumBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    premiumBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 24,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 