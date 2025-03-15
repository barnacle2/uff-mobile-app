import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    restaurant: string;
    selectedOptions?: string[];
}

interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(50); // Fixed delivery fee
    const [total, setTotal] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [address, setAddress] = useState<DeliveryAddress>({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        instructions: ''
    });

    const paymentMethods: PaymentMethod[] = [
        { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
        { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
        { id: 'gcash', name: 'GCash', icon: 'wallet-outline' },
        { id: 'maya', name: 'Maya', icon: 'wallet-outline' }
    ];

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cartItems]);

    const loadCart = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const calculateTotal = () => {
        const itemsTotal = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price.replace('₱', '')) * item.quantity);
        }, 0);
        setSubtotal(itemsTotal);
        setTotal(itemsTotal + deliveryFee);
    };

    const validateForm = () => {
        if (!address.street || !address.city || !address.state || !address.zipCode) {
            Alert.alert('Error', 'Please fill in all address fields');
            return false;
        }
        if (!selectedPayment) {
            Alert.alert('Error', 'Please select a payment method');
            return false;
        }
        return true;
    };

    const handleCheckout = async () => {
        if (!validateForm()) return;

        try {
            // In a real app, you would:
            // 1. Send order to backend
            // 2. Process payment
            // 3. Get confirmation
            
            // For now, we'll just clear the cart and show success
            await AsyncStorage.removeItem('cart');
            
            // Save order to order history
            const order = {
                id: Date.now().toString(),
                items: cartItems,
                total: total,
                deliveryAddress: address,
                paymentMethod: selectedPayment,
                status: 'pending',
                date: new Date().toISOString()
            };

            const savedOrders = await AsyncStorage.getItem('orders');
            const orders = savedOrders ? JSON.parse(savedOrders) : [];
            orders.push(order);
            await AsyncStorage.setItem('orders', JSON.stringify(orders));

            Alert.alert(
                'Order Placed Successfully',
                'Thank you for your order! You can track its status in the Orders section.',
                [
                    {
                        text: 'View Orders',
                        onPress: () => router.push('/orders'),
                    },
                    {
                        text: 'Continue Shopping',
                        onPress: () => router.push('/'),
                    }
                ]
            );
        } catch (error) {
            console.error('Error processing order:', error);
            Alert.alert('Error', 'Failed to process your order. Please try again.');
        }
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
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Street Address"
                        value={address.street}
                        onChangeText={(text) => setAddress({...address, street: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={address.city}
                        onChangeText={(text) => setAddress({...address, city: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="State/Province"
                        value={address.state}
                        onChangeText={(text) => setAddress({...address, state: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="ZIP Code"
                        value={address.zipCode}
                        onChangeText={(text) => setAddress({...address, zipCode: text})}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Delivery Instructions (Optional)"
                        value={address.instructions}
                        onChangeText={(text) => setAddress({...address, instructions: text})}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.paymentOption,
                                selectedPayment === method.id && styles.selectedPayment
                            ]}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <Ionicons 
                                name={method.icon as any}
                                size={24}
                                color={selectedPayment === method.id ? '#CA0606' : '#333'}
                            />
                            <Text style={[
                                styles.paymentText,
                                selectedPayment === method.id && styles.selectedPaymentText
                            ]}>
                                {method.name}
                            </Text>
                            {selectedPayment === method.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#CA0606" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.summaryItem}>
                            <View style={styles.summaryItemLeft}>
                                <Text style={styles.summaryItemName}>
                                    {item.name} × {item.quantity}
                                </Text>
                                <Text style={styles.summaryItemRestaurant}>
                                    {item.restaurant}
                                </Text>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <View style={styles.addOnsContainer}>
                                        <Text style={styles.addOnsTitle}>Add-ons:</Text>
                                        {item.selectedOptions.map((option, optionIndex) => (
                                            <Text key={optionIndex} style={styles.addOnItem}>
                                                • {option}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <Text style={styles.summaryItemPrice}>
                                ₱{(parseFloat(item.price.replace('₱', '')) * item.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₱{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>₱{deliveryFee.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₱{total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.bottomButton}>
                <TouchableOpacity 
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                >
                    <Text style={styles.checkoutButtonText}>
                        Place Order - ₱{total.toFixed(2)}
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
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    selectedPayment: {
        borderColor: '#CA0606',
        backgroundColor: '#FFF0F0',
    },
    paymentText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    selectedPaymentText: {
        color: '#CA0606',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryItemLeft: {
        flex: 1,
    },
    summaryItemName: {
        fontSize: 16,
        marginBottom: 4,
    },
    summaryItemRestaurant: {
        fontSize: 14,
        color: '#666',
    },
    summaryItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    totalRow: {
        marginTop: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    bottomButton: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    checkoutButton: {
        backgroundColor: '#CA0606',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addOnsContainer: {
        marginTop: 4,
    },
    addOnsTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    addOnItem: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
}); 