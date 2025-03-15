import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        loadOrder();
    }, [params.orderNumber]);

    const loadOrder = async () => {
        try {
            const orderHistory = await AsyncStorage.getItem('orderHistory');
            if (orderHistory) {
                const orders = JSON.parse(orderHistory);
                const currentOrder = orders.find(
                    (o: any) => o.orderNumber === params.orderNumber
                );
                if (currentOrder) {
                    setOrder(currentOrder);
                }
            }
        } catch (error) {
            console.error('Error loading order:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing':
                return 'time-outline';
            case 'confirmed':
                return 'checkmark-circle-outline';
            case 'preparing':
                return 'restaurant-outline';
            case 'delivering':
                return 'bicycle-outline';
            case 'completed':
                return 'checkmark-done-circle-outline';
            default:
                return 'help-circle-outline';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing':
                return '#f39c12';
            case 'confirmed':
                return '#3498db';
            case 'preparing':
                return '#e67e22';
            case 'delivering':
                return '#2ecc71';
            case 'completed':
                return '#27ae60';
            default:
                return '#95a5a6';
        }
    };

    if (!order) {
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
                    style={styles.closeButton}
                    onPress={() => router.replace('/')}
                >
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Image 
                    source={require('../assets/images/order-success.png')}
                    style={styles.successImage}
                />

                <Text style={styles.title}>Order Confirmed!</Text>
                <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>

                <View style={styles.statusContainer}>
                    <Ionicons 
                        name={getStatusIcon(order.status)} 
                        size={32} 
                        color={getStatusColor(order.status)} 
                    />
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusTitle}>Order Status</Text>
                        <Text style={[
                            styles.statusText,
                            { color: getStatusColor(order.status) }
                        ]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Text>
                    </View>
                </View>

                <View style={styles.deliveryInfo}>
                    {order.orderType === 'delivery' ? (
                        <>
                            <Text style={styles.infoLabel}>Delivery Address</Text>
                            <View style={styles.addressContainer}>
                                <Ionicons name="location-outline" size={24} color="#666" />
                                <View style={styles.addressDetails}>
                                    <Text style={styles.addressLabel}>
                                        {order.deliveryAddress.label}
                                    </Text>
                                    <Text style={styles.addressText}>
                                        {order.deliveryAddress.address}
                                    </Text>
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={styles.infoLabel}>Pickup Information</Text>
                            <View style={styles.addressContainer}>
                                <Ionicons name="restaurant-outline" size={24} color="#666" />
                                <View style={styles.addressDetails}>
                                    <Text style={styles.addressLabel}>
                                        Universal Fast Food
                                    </Text>
                                    <Text style={styles.addressText}>
                                        123 Main Street, City
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.paymentInfo}>
                    <Text style={styles.infoLabel}>Payment Method</Text>
                    <View style={styles.paymentMethod}>
                        <Ionicons 
                            name={getPaymentIcon(order.paymentMethod.type)} 
                            size={24} 
                            color="#666" 
                        />
                        <Text style={styles.paymentText}>
                            {getPaymentLabel(order.paymentMethod.type)}
                        </Text>
                    </View>
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>
                        ${order.total.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.trackButton}
                    onPress={() => router.push({
                        pathname: '/track-order',
                        params: { orderNumber: order.orderNumber }
                    })}
                >
                    <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 15,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    successImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderNumber: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 30,
        width: '100%',
    },
    statusInfo: {
        marginLeft: 15,
    },
    statusTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
    },
    deliveryInfo: {
        width: '100%',
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
    },
    addressDetails: {
        marginLeft: 12,
        flex: 1,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
    },
    paymentInfo: {
        width: '100%',
        marginBottom: 20,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        gap: 12,
    },
    paymentText: {
        fontSize: 16,
        color: '#333',
    },
    totalContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    trackButton: {
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    trackButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
}); 