import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderStatus {
    status: string;
    time: string;
    description: string;
    isCompleted: boolean;
}

export default function TrackOrderPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [order, setOrder] = useState<any>(null);
    const [currentStatus, setCurrentStatus] = useState<string>('');
    const [statusHistory, setStatusHistory] = useState<OrderStatus[]>([]);

    useEffect(() => {
        loadOrder();
        const interval = setInterval(updateOrderStatus, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
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
                    setCurrentStatus(currentOrder.status);
                    generateStatusHistory(currentOrder.status);
                }
            }
        } catch (error) {
            console.error('Error loading order:', error);
        }
    };

    const updateOrderStatus = async () => {
        // In a real app, make API call here to get latest status
        // For demo, we'll simulate status updates
        const statuses = ['processing', 'confirmed', 'preparing', 'delivering', 'completed'];
        const currentIndex = statuses.indexOf(currentStatus);
        if (currentIndex < statuses.length - 1) {
            const newStatus = statuses[currentIndex + 1];
            setCurrentStatus(newStatus);
            generateStatusHistory(newStatus);

            // Update order in storage
            try {
                const orderHistory = await AsyncStorage.getItem('orderHistory');
                if (orderHistory) {
                    const orders = JSON.parse(orderHistory);
                    const updatedOrders = orders.map((o: any) => {
                        if (o.orderNumber === params.orderNumber) {
                            return { ...o, status: newStatus };
                        }
                        return o;
                    });
                    await AsyncStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        }
    };

    const generateStatusHistory = (status: string) => {
        const statuses: OrderStatus[] = [
            {
                status: 'processing',
                time: '2 min ago',
                description: 'Your order has been received and is being processed',
                isCompleted: false
            },
            {
                status: 'confirmed',
                time: '',
                description: 'Restaurant has confirmed your order',
                isCompleted: false
            },
            {
                status: 'preparing',
                time: '',
                description: 'Your food is being prepared',
                isCompleted: false
            },
            {
                status: 'delivering',
                time: '',
                description: order?.orderType === 'delivery' 
                    ? 'Your order is on the way' 
                    : 'Your order is ready for pickup',
                isCompleted: false
            },
            {
                status: 'completed',
                time: '',
                description: order?.orderType === 'delivery'
                    ? 'Your order has been delivered'
                    : 'Your order has been picked up',
                isCompleted: false
            }
        ];

        const currentIndex = statuses.findIndex(s => s.status === status);
        const updatedStatuses = statuses.map((s, index) => ({
            ...s,
            isCompleted: index <= currentIndex,
            time: index === currentIndex ? 'Just now' : 
                  index < currentIndex ? `${(currentIndex - index) * 5} min ago` : ''
        }));

        setStatusHistory(updatedStatuses);
    };

    const getStatusColor = (isCompleted: boolean) => {
        return isCompleted ? '#27ae60' : '#ddd';
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
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>
                        Order #{order.orderNumber}
                    </Text>
                    <Text style={styles.orderType}>
                        {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                    </Text>
                </View>

                <View style={styles.timeline}>
                    {statusHistory.map((status, index) => (
                        <View key={status.status} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <View style={[
                                    styles.statusDot,
                                    { backgroundColor: getStatusColor(status.isCompleted) }
                                ]}>
                                    {status.isCompleted && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                                {index < statusHistory.length - 1 && (
                                    <View style={[
                                        styles.statusLine,
                                        { backgroundColor: getStatusColor(status.isCompleted) }
                                    ]} />
                                )}
                            </View>
                            <View style={styles.timelineContent}>
                                <Text style={styles.statusTitle}>
                                    {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                                </Text>
                                <Text style={styles.statusDescription}>
                                    {status.description}
                                </Text>
                                {status.time && (
                                    <Text style={styles.statusTime}>{status.time}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {order.orderType === 'delivery' && currentStatus === 'delivering' && (
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryTitle}>Delivery Details</Text>
                        <View style={styles.deliveryAddress}>
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
                        <Text style={styles.estimatedTime}>
                            Estimated delivery: 15-20 minutes
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.supportButton}
                    onPress={() => {
                        // Implement support chat/call
                        console.log('Support button pressed');
                    }}
                >
                    <Ionicons name="chatbubble-outline" size={24} color="#CA0606" />
                    <Text style={styles.supportButtonText}>Need Help?</Text>
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
    orderInfo: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    orderType: {
        fontSize: 16,
        color: '#666',
    },
    timeline: {
        padding: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 40,
    },
    statusDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    timelineContent: {
        flex: 1,
        paddingLeft: 20,
        paddingBottom: 20,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    statusDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    statusTime: {
        fontSize: 12,
        color: '#999',
    },
    deliveryInfo: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    deliveryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    deliveryAddress: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
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
    estimatedTime: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CA0606',
        gap: 8,
    },
    supportButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#CA0606',
    },
}); 