import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Order {
    id: string;
    customerName: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    orderType: 'delivery' | 'pickup';
    timestamp: string;
}

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'delivered'>('pending');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        // In a real app, fetch from your backend
        const mockOrders: Order[] = [
            {
                id: '12345',
                customerName: 'John Doe',
                items: [
                    { name: 'Chicken Joy', quantity: 2, price: 99 },
                    { name: 'Jolly Spaghetti', quantity: 1, price: 75 }
                ],
                total: 273,
                status: 'pending',
                orderType: 'delivery',
                timestamp: '2024-04-18T10:30:00'
            },
            {
                id: '12346',
                customerName: 'Jane Smith',
                items: [
                    { name: 'Burger Steak', quantity: 1, price: 89 }
                ],
                total: 89,
                status: 'preparing',
                orderType: 'pickup',
                timestamp: '2024-04-18T10:15:00'
            }
        ];
        setOrders(mockOrders);
    };

    const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        Alert.alert('Success', `Order ${orderId} status updated to ${newStatus}`);
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return '#FFA000';
            case 'preparing': return '#1976D2';
            case 'ready': return '#43A047';
            case 'delivered': return '#757575';
            case 'cancelled': return '#D32F2F';
            default: return '#666';
        }
    };

    const filteredOrders = orders.filter(order => order.status === activeTab);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabs}>
                {(['pending', 'preparing', 'ready', 'delivered'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {filteredOrders.map(order => (
                    <View key={order.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={styles.orderId}>Order #{order.id}</Text>
                                <Text style={styles.orderTime}>
                                    {new Date(order.timestamp).toLocaleString()}
                                </Text>
                            </View>
                            <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                                {order.status.toUpperCase()}
                            </Text>
                        </View>

                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{order.customerName}</Text>
                            <Text style={styles.orderType}>{order.orderType.toUpperCase()}</Text>
                        </View>

                        <View style={styles.itemsList}>
                            {order.items.map((item, index) => (
                                <View key={index} style={styles.orderItem}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                    <Text style={styles.itemPrice}>₱{item.price}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.orderFooter}>
                            <Text style={styles.totalAmount}>Total: ₱{order.total}</Text>
                            <View style={styles.actions}>
                                {order.status === 'pending' && (
                                    <>
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.acceptButton]}
                                            onPress={() => handleUpdateStatus(order.id, 'preparing')}
                                        >
                                            <Text style={styles.actionButtonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.actionButton, styles.rejectButton]}
                                            onPress={() => handleUpdateStatus(order.id, 'cancelled')}
                                        >
                                            <Text style={styles.actionButtonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {order.status === 'preparing' && (
                                    <TouchableOpacity 
                                        style={[styles.actionButton, styles.readyButton]}
                                        onPress={() => handleUpdateStatus(order.id, 'ready')}
                                    >
                                        <Text style={styles.actionButtonText}>Mark as Ready</Text>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'ready' && (
                                    <TouchableOpacity 
                                        style={[styles.actionButton, styles.completeButton]}
                                        onPress={() => handleUpdateStatus(order.id, 'delivered')}
                                    >
                                        <Text style={styles.actionButtonText}>Complete Order</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#CA0606',
    },
    tabText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#CA0606',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    customerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    customerName: {
        fontSize: 14,
        fontWeight: '500',
    },
    orderType: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    itemsList: {
        marginBottom: 15,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 10,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
    },
    orderFooter: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    acceptButton: {
        backgroundColor: '#43A047',
    },
    rejectButton: {
        backgroundColor: '#D32F2F',
    },
    readyButton: {
        backgroundColor: '#1976D2',
    },
    completeButton: {
        backgroundColor: '#43A047',
    },
}); 