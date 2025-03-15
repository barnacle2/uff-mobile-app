import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentMethod {
    id: string;
    type: 'cash' | 'card' | 'gcash' | 'maya';
    isDefault: boolean;
}

export default function PaymentPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        loadPaymentMethods();
        if (params.orderData) {
            setOrderData(JSON.parse(params.orderData as string));
        }
    }, [params.orderData]);

    const initializeDefaultPaymentMethods = async () => {
        const defaultMethods: PaymentMethod[] = [
            {
                id: 'cash-1',
                type: 'cash',
                isDefault: true
            },
            {
                id: 'card-1',
                type: 'card',
                isDefault: false
            },
            {
                id: 'gcash-1',
                type: 'gcash',
                isDefault: false
            },
            {
                id: 'maya-1',
                type: 'maya',
                isDefault: false
            }
        ];
        await AsyncStorage.setItem('paymentMethods', JSON.stringify(defaultMethods));
        return defaultMethods;
    };

    const loadPaymentMethods = async () => {
        try {
            const data = await AsyncStorage.getItem('paymentMethods');
            let methods;
            if (!data) {
                // Initialize default payment methods if none exist
                methods = await initializeDefaultPaymentMethods();
            } else {
                methods = JSON.parse(data);
            }
            setPaymentMethods(methods);
            const defaultMethod = methods.find((method: PaymentMethod) => method.isDefault);
            setSelectedMethod(defaultMethod || methods[0]);
        } catch (error) {
            console.error('Error loading payment methods:', error);
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

    const handlePlaceOrder = async () => {
        if (!selectedMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        try {
            // In a real app, make API call here to process payment and create order
            const finalOrderData = {
                ...orderData,
                paymentMethod: selectedMethod,
                orderNumber: `UFF-${Date.now()}`,
                status: 'processing'
            };

            // Save order to history
            const existingOrders = await AsyncStorage.getItem('orderHistory');
            const orders = existingOrders ? JSON.parse(existingOrders) : [];
            orders.unshift(finalOrderData);
            await AsyncStorage.setItem('orderHistory', JSON.stringify(orders));

            // Clear cart
            await AsyncStorage.setItem('cartItems', JSON.stringify([]));

            // Navigate to order confirmation
            router.replace({
                pathname: '/order-confirmation',
                params: { orderNumber: finalOrderData.orderNumber }
            });
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        }
    };

    if (!orderData) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity 
                            key={method.id}
                            style={[
                                styles.methodItem,
                                selectedMethod?.id === method.id && styles.methodItemSelected
                            ]}
                            onPress={() => setSelectedMethod(method)}
                        >
                            <View style={styles.methodInfo}>
                                <Ionicons 
                                    name={getPaymentIcon(method.type)} 
                                    size={24} 
                                    color={selectedMethod?.id === method.id ? '#CA0606' : '#333'} 
                                />
                                <Text style={[
                                    styles.methodLabel,
                                    selectedMethod?.id === method.id && styles.methodLabelSelected
                                ]}>
                                    {getPaymentLabel(method.type)}
                                </Text>
                            </View>
                            {method.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultText}>Default</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>
                            ${orderData.subtotal.toFixed(2)}
                        </Text>
                    </View>
                    {orderData.deliveryFee > 0 && (
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>
                                ${orderData.deliveryFee.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    <View style={[styles.summaryItem, styles.totalItem]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            ${orderData.total.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.placeOrderButton}
                    onPress={handlePlaceOrder}
                >
                    <Text style={styles.placeOrderText}>
                        Place Order
                    </Text>
                    <Text style={styles.placeOrderTotal}>
                        ${orderData.total.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>
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
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    methodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 10,
    },
    methodItemSelected: {
        borderColor: '#CA0606',
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
    methodLabelSelected: {
        color: '#CA0606',
        fontWeight: '600',
    },
    defaultBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultText: {
        fontSize: 12,
        color: '#666',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalItem: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    placeOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 12,
    },
    placeOrderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeOrderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
}); 