import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface DeliveryAddress {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
}

export default function OrderPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);
    const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadCartItems();
        loadAddresses();
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [items, orderType]);

    const loadCartItems = async () => {
        try {
            const cartData = await AsyncStorage.getItem('cartItems');
            let cartItems;
            if (!cartData) {
                // Initialize with test items if cart is empty
                cartItems = [
                    {
                        id: '1',
                        name: 'Chicken Joy',
                        price: 89.00,
                        quantity: 1,
                        image: 'https://example.com/chicken.jpg'
                    },
                    {
                        id: '2',
                        name: 'Jolly Spaghetti',
                        price: 149.00,
                        quantity: 1,
                        image: 'https://example.com/spaghetti.jpg'
                    }
                ];
                await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
            } else {
                cartItems = JSON.parse(cartData);
            }
            setItems(cartItems);
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    };

    const loadAddresses = async () => {
        try {
            const addressData = await AsyncStorage.getItem('addresses');
            let savedAddresses;
            if (!addressData) {
                // Initialize with a default address if none exists
                savedAddresses = [
                    {
                        id: 'home-1',
                        label: 'Home',
                        address: '123 Main Street, City',
                        isDefault: true
                    }
                ];
                await AsyncStorage.setItem('addresses', JSON.stringify(savedAddresses));
            } else {
                savedAddresses = JSON.parse(addressData);
            }
            setAddresses(savedAddresses);
            const defaultAddress = savedAddresses.find((addr: DeliveryAddress) => addr.isDefault);
            setSelectedAddress(defaultAddress || savedAddresses[0]);
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const calculateTotals = () => {
        const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSubtotal(itemsTotal);
        setDeliveryFee(orderType === 'delivery' ? 5.99 : 0);
        setTotal(itemsTotal + (orderType === 'delivery' ? 5.99 : 0));
    };

    const handleAddressSelect = () => {
        router.push('/addresses');
    };

    const handlePayment = () => {
        if (orderType === 'delivery' && !selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }

        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }
        
        const orderData = {
            items,
            orderType,
            deliveryAddress: selectedAddress,
            subtotal,
            deliveryFee,
            total,
            status: 'pending',
            timestamp: new Date().toISOString(),
        };

        // Navigate to payment page with order data
        router.push({
            pathname: '/payment',
            params: { orderData: JSON.stringify(orderData) }
        });
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
                <Text style={styles.headerTitle}>Place Order</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Order Type Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Type</Text>
                    <View style={styles.orderTypeContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.orderTypeButton,
                                orderType === 'delivery' && styles.orderTypeButtonActive
                            ]}
                            onPress={() => setOrderType('delivery')}
                        >
                            <Ionicons 
                                name="bicycle-outline" 
                                size={24} 
                                color={orderType === 'delivery' ? '#fff' : '#333'} 
                            />
                            <Text style={[
                                styles.orderTypeText,
                                orderType === 'delivery' && styles.orderTypeTextActive
                            ]}>Delivery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.orderTypeButton,
                                orderType === 'pickup' && styles.orderTypeButtonActive
                            ]}
                            onPress={() => setOrderType('pickup')}
                        >
                            <Ionicons 
                                name="restaurant-outline" 
                                size={24} 
                                color={orderType === 'pickup' ? '#fff' : '#333'} 
                            />
                            <Text style={[
                                styles.orderTypeText,
                                orderType === 'pickup' && styles.orderTypeTextActive
                            ]}>Pickup</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Delivery Address */}
                {orderType === 'delivery' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <TouchableOpacity 
                            style={styles.addressContainer}
                            onPress={handleAddressSelect}
                        >
                            {selectedAddress ? (
                                <>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.addressLabel}>
                                            {selectedAddress.label}
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {selectedAddress.address}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                                </>
                            ) : (
                                <Text style={styles.addAddressText}>
                                    + Add delivery address
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemContainer}>
                            <Image 
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Order Total */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.totalItem}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    {orderType === 'delivery' && (
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Delivery Fee</Text>
                            <Text style={styles.totalValue}>${deliveryFee.toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={[styles.totalItem, styles.finalTotal]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.paymentButton}
                    onPress={handlePayment}
                >
                    <Text style={styles.paymentButtonText}>
                        Proceed to Payment
                    </Text>
                    <Text style={styles.paymentButtonTotal}>
                        ${total.toFixed(2)}
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
    orderTypeContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    orderTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        gap: 10,
    },
    orderTypeButtonActive: {
        backgroundColor: '#CA0606',
        borderColor: '#CA0606',
    },
    orderTypeText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    orderTypeTextActive: {
        color: '#fff',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addressInfo: {
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
    addAddressText: {
        fontSize: 16,
        color: '#CA0606',
        textAlign: 'center',
        flex: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    finalTotal: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    finalTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    paymentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 12,
    },
    paymentButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    paymentButtonTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
}); 