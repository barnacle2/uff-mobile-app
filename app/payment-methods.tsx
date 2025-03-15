import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentMethod {
    id: string;
    type: 'cash' | 'card' | 'gcash' | 'maya';
    isDefault: boolean;
}

export default function PaymentMethodsPage() {
    const router = useRouter();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        try {
            const savedMethods = await AsyncStorage.getItem('paymentMethods');
            if (savedMethods) {
                setPaymentMethods(JSON.parse(savedMethods));
            } else {
                // Initialize with default payment methods
                const defaultMethods: PaymentMethod[] = [
                    { id: '1', type: 'cash', isDefault: true },
                    { id: '2', type: 'card', isDefault: false },
                    { id: '3', type: 'gcash', isDefault: false },
                    { id: '4', type: 'maya', isDefault: false },
                ];
                await AsyncStorage.setItem('paymentMethods', JSON.stringify(defaultMethods));
                setPaymentMethods(defaultMethods);
            }
        } catch (error) {
            console.error('Error loading payment methods:', error);
        }
    };

    const handleSetDefault = async (methodId: string) => {
        const updatedMethods = paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === methodId
        }));
        try {
            await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
            setPaymentMethods(updatedMethods);
        } catch (error) {
            console.error('Error updating payment methods:', error);
        }
    };

    const getPaymentIcon = (type: string) => {
        switch (type) {
            case 'cash':
                return 'cash-outline';
            case 'card':
                return 'card-outline';
            case 'gcash':
                return 'wallet-outline';
            case 'maya':
                return 'wallet-outline';
            default:
                return 'card-outline';
        }
    };

    const getPaymentLabel = (type: string) => {
        switch (type) {
            case 'cash':
                return 'Cash on Delivery';
            case 'card':
                return 'Credit/Debit Card';
            case 'gcash':
                return 'GCash';
            case 'maya':
                return 'Maya';
            default:
                return type;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodCard,
                            method.isDefault && styles.defaultCard
                        ]}
                        onPress={() => handleSetDefault(method.id)}
                    >
                        <View style={styles.methodInfo}>
                            <Ionicons 
                                name={getPaymentIcon(method.type)} 
                                size={24} 
                                color={method.isDefault ? '#CA0606' : '#666'} 
                            />
                            <Text style={[
                                styles.methodLabel,
                                method.isDefault && styles.defaultText
                            ]}>
                                {getPaymentLabel(method.type)}
                            </Text>
                        </View>
                        {method.isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    defaultCard: {
        borderColor: '#CA0606',
        backgroundColor: '#FFF5F5',
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    methodLabel: {
        fontSize: 16,
        color: '#333',
    },
    defaultText: {
        color: '#CA0606',
        fontWeight: 'bold',
    },
    defaultBadge: {
        backgroundColor: '#CA0606',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
}); 