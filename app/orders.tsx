import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    restaurant: string;
    selectedOptions?: string[];
}

interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        instructions?: string;
    };
    paymentMethod: string;
    status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
    date: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const savedOrders = await AsyncStorage.getItem('orders');
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return '#f39c12';
            case 'preparing':
                return '#3498db';
            case 'delivering':
                return '#2ecc71';
            case 'delivered':
                return '#27ae60';
            case 'cancelled':
                return '#e74c3c';
            default:
                return '#666';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <View key={order.id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <View>
                                    <Text style={styles.orderId}>Order #{order.id}</Text>
                                    <Text style={styles.orderDate}>
                                        {formatDate(order.date)}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(order.status) }
                                ]}>
                                    <Text style={styles.statusText}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.orderItems}>
                                {order.items.map((item, index) => (
                                    <View key={index} style={styles.orderItem}>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>
                                                {item.name} × {item.quantity}
                                            </Text>
                                            <Text style={styles.itemRestaurant}>
                                                {item.restaurant}
                                            </Text>
                                        </View>
                                        <Text style={styles.itemPrice}>
                                            ₱{(parseFloat(item.price.replace('₱', '')) * item.quantity).toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.orderDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Delivery Address</Text>
                                    <Text style={styles.detailValue}>
                                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Payment Method</Text>
                                    <Text style={styles.detailValue}>
                                        {order.paymentMethod.charAt(0).toUpperCase() + 
                                         order.paymentMethod.slice(1)}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Amount</Text>
                                    <Text style={styles.totalValue}>
                                        ₱{order.total.toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {order.status === 'delivered' && (
                                <TouchableOpacity 
                                    style={styles.reorderButton}
                                    onPress={() => {
                                        // Implement reorder functionality
                                    }}
                                >
                                    <Ionicons name="refresh" size={20} color="#fff" />
                                    <Text style={styles.reorderButtonText}>Reorder</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>No orders yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Your order history will appear here
                        </Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.browseButtonText}>Start Ordering</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    orderCard: {
        margin: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderItems: {
        padding: 15,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        marginBottom: 4,
    },
    itemRestaurant: {
        fontSize: 12,
        color: '#666',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    },
    orderDetails: {
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    reorderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CA0606',
        margin: 15,
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    reorderButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    browseButton: {
        backgroundColor: '#CA0606',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 