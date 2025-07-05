import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../components/ThemeProvider';

interface AuthScreenProps {
    onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
    const { theme } = useTheme();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return text;
    };

    const handleSendOtp = async () => {
        if (phoneNumber.length < 10) {
            Alert.alert('Ошибка', 'Введите корректный номер телефона');
            return;
        }

        setIsLoading(true);
        try {
            // Здесь будет API вызов для отправки OTP
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsOtpSent(true);
            Alert.alert('Успешно', 'Код подтверждения отправлен на ваш номер');
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось отправить код. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 4) {
            Alert.alert('Ошибка', 'Введите 4-значный код');
            return;
        }

        setIsLoading(true);
        try {
            // Здесь будет API вызов для проверки OTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            onAuthSuccess();
        } catch (error) {
            Alert.alert('Ошибка', 'Неверный код. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
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
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.header}
                >
                    <View style={styles.logoContainer}>
                        <Ionicons name="trending-up" size={60} color="#fff" />
                        <Text style={styles.appName}>PriceTracker</Text>
                        <Text style={styles.appSubtitle}>Умное отслеживание цен</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {isOtpSent ? 'Подтверждение' : 'Регистрация'}
                    </Text>

                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {isOtpSent
                            ? 'Введите код, отправленный на ваш номер'
                            : 'Введите номер телефона для регистрации'
                        }
                    </Text>

                    {!isOtpSent ? (
                        <View style={styles.inputContainer}>
                            <View style={styles.phoneInputWrapper}>
                                <Ionicons name="call" size={20} color={theme.colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, inputStyle]}
                                    placeholder="+7 (999) 123-45-67"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={phoneNumber}
                                    onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
                                    keyboardType="phone-pad"
                                    maxLength={18}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, buttonStyle]}
                                onPress={handleSendOtp}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading ? 'Отправка...' : 'Отправить код'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <View style={styles.otpContainer}>
                                {[0, 1, 2, 3].map((index) => (
                                    <TextInput
                                        key={index}
                                        style={[styles.otpInput, inputStyle]}
                                        value={otp[index] || ''}
                                        onChangeText={(text) => {
                                            const newOtp = otp.split('');
                                            newOtp[index] = text;
                                            setOtp(newOtp.join(''));
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        textAlign="center"
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[styles.button, buttonStyle]}
                                onPress={handleVerifyOtp}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonText}>
                                    {isLoading ? 'Проверка...' : 'Подтвердить'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.resendButton}
                                onPress={handleSendOtp}
                                disabled={isLoading}
                            >
                                <Text style={[styles.resendText, { color: theme.colors.primary }]}>
                                    Отправить код повторно
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                            Нажимая кнопку, вы соглашаетесь с{' '}
                            <Text style={{ color: theme.colors.primary }}>Условиями использования</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginTop: 16,
    },
    appSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 8,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    inputContainer: {
        gap: 24,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '600',
    },
    button: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    resendButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
}); 