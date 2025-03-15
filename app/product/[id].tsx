import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OptionItem {
    name: string;
    price: string;
    available?: boolean;
}

interface OptionGroup {
    title: string;
    subtitle?: string;
    items: OptionItem[];
}

interface Product {
    id: string;
    name: string;
    price: string;
    basePrice: string;
    image: any;
    description: string;
    restaurant: string;
    options: OptionGroup[];
}

// Sample product data - In a real app, this would come from an API or database
const productData: { [key: string]: Product } = {
    'jollibee-chicken-joy': {
        id: 'jollibee-chicken-joy',
        name: 'Chicken Joy',
        price: '₱89.00',
        basePrice: '₱89.00',
        image: require('../../assets/images/top picks/11.png'),
        description: 'Crispylicious, Juicylicious Chicken Joy',
        restaurant: 'Jollibee',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Rice',
                        price: '₱35.00',
                        available: true
                    },
                    {
                        name: 'Gravy',
                        price: '₱15.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'jollibee-jolly-spaghetti': {
        id: 'jollibee-jolly-spaghetti',
        name: 'Jolly Spaghetti',
        price: '₱79.00',
        basePrice: '₱79.00',
        image: require('../../assets/images/top picks/6.png'),
        description: 'Sweet-style spaghetti with ground meat and hotdog',
        restaurant: 'Jollibee',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Cheese',
                        price: '₱20.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'mcdonalds-big-mac': {
        id: 'mcdonalds-big-mac',
        name: 'Big Mac',
        price: '₱169.00',
        basePrice: '₱169.00',
        image: require('../../assets/images/top picks/9.png'),
        description: 'Iconic burger with two all-beef patties',
        restaurant: 'McDonald\'s',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Cheese',
                        price: '₱25.00',
                        available: true
                    },
                    {
                        name: 'Large Fries',
                        price: '₱65.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'greenwich-hawaiian-overload': {
        id: 'greenwich-hawaiian-overload',
        name: 'Hawaiian Overload',
        price: '₱299.00',
        basePrice: '₱299.00',
        image: require('../../assets/images/top picks/1.png'),
        description: 'Pizza loaded with ham, pineapple, and cheese',
        restaurant: 'Greenwich',
        options: [
            {
                title: 'Size Options',
                items: [
                    {
                        name: 'Large Size',
                        price: '₱150.00',
                        available: true
                    }
                ]
            },
            {
                title: 'Extra Toppings',
                items: [
                    {
                        name: 'Extra Cheese',
                        price: '₱50.00',
                        available: true
                    },
                    {
                        name: 'Extra Ham',
                        price: '₱45.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'greenwich-lasagna-supreme': {
        id: 'greenwich-lasagna-supreme',
        name: 'Lasagna Supreme',
        price: '₱129.00',
        basePrice: '₱129.00',
        image: require('../../assets/images/top picks/5.png'),
        description: 'Rich and creamy lasagna with meat sauce',
        restaurant: 'Greenwich',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Cheese',
                        price: '₱35.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'manginasal-chicken-inasal-paa': {
        id: 'manginasal-chicken-inasal-paa',
        name: 'Chicken Inasal Paa',
        price: '₱129.00',
        basePrice: '₱129.00',
        image: require('../../assets/images/top picks/10.png'),
        description: 'Grilled chicken leg quarter with unlimited rice',
        restaurant: 'Mang Inasal',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Chicken Oil',
                        price: '₱15.00',
                        available: true
                    },
                    {
                        name: 'Extra Sauce',
                        price: '₱10.00',
                        available: true
                    }
                ]
            }
        ]
    },
    'manginasal-chicken-inasal-pecho': {
        id: 'manginasal-chicken-inasal-pecho',
        name: 'Chicken Inasal Pecho',
        price: '₱139.00',
        basePrice: '₱139.00',
        image: require('../../assets/images/top picks/11.png'),
        description: 'Grilled chicken breast with unlimited rice',
        restaurant: 'Mang Inasal',
        options: [
            {
                title: 'Optional Add-ons',
                items: [
                    {
                        name: 'Extra Chicken Oil',
                        price: '₱15.00',
                        available: true
                    },
                    {
                        name: 'Extra Sauce',
                        price: '₱10.00',
                        available: true
                    }
                ]
            }
        ]
    }
};

export default function ProductPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = productData[id as keyof typeof productData];
    const [cartItemCount, setCartItemCount] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{[key: string]: boolean}>({});
    const badgeScale = new Animated.Value(1);

    useEffect(() => {
        loadCartCount();
        const interval = setInterval(loadCartCount, 1000);
        return () => clearInterval(interval);
    }, []);

    const loadCartCount = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartItemCount(totalItems);
            }
        } catch (error) {
            console.error('Error loading cart count:', error);
        }
    };

    const animateCartBadge = () => {
        Animated.sequence([
            Animated.timing(badgeScale, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(badgeScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const toggleOption = (optionName: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: !prev[optionName]
        }));
    };

    const calculateTotalPrice = () => {
        let total = parseFloat(product.basePrice.replace('₱', ''));
        Object.entries(selectedOptions).forEach(([optionName, isSelected]) => {
            if (isSelected) {
                // Find the option in the product's options
                for (const optionGroup of product.options) {
                    const option = optionGroup.items.find(item => item.name === optionName);
                    if (option) {
                        total += parseFloat(option.price.replace('₱', ''));
                        break;
                    }
                }
            }
        });
        return `₱${total.toFixed(2)}`;
    };

    const addToCart = async () => {
        try {
            const itemId = `${product.id}-${Date.now()}`;
            const savedCart = await AsyncStorage.getItem('cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];
            
            const cartItem = {
                id: itemId,
                name: product.name,
                price: calculateTotalPrice(),
                image: product.image,
                quantity: 1,
                restaurant: product.restaurant,
                selectedOptions: Object.entries(selectedOptions)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([optionName]) => optionName)
            };
            
            cart.push(cartItem);
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            await loadCartCount();
            animateCartBadge();
            Alert.alert('Success', 'Item added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart');
        }
    };

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Product not found</Text>
            </View>
        );
    }

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
                <TouchableOpacity 
                    style={styles.cartButton}
                    onPress={() => router.push('/cart')}
                >
                    <View>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                        {cartItemCount > 0 && (
                            <Animated.View 
                                style={[
                                    styles.cartBadge,
                                    { transform: [{ scale: badgeScale }] }
                                ]}
                            >
                                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                            </Animated.View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Product Image */}
                <Image source={product.image} style={styles.productImage} />

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.basePrice}>{product.basePrice}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>

                {/* Options */}
                {product.options.map((optionGroup, groupIndex) => (
                    <View key={groupIndex} style={styles.optionGroup}>
                        <Text style={styles.optionGroupTitle}>{optionGroup.title}</Text>
                        {optionGroup.subtitle && (
                            <Text style={styles.optionGroupSubtitle}>{optionGroup.subtitle}</Text>
                        )}
                        {optionGroup.items.map((option, optionIndex) => (
                            <TouchableOpacity
                                key={optionIndex}
                                style={[
                                    styles.optionItem,
                                    !option.available && styles.optionItemDisabled,
                                    selectedOptions[option.name] && styles.optionItemSelected
                                ]}
                                onPress={() => option.available && toggleOption(option.name)}
                                disabled={!option.available}
                            >
                                <View style={styles.optionItemContent}>
                                    <Text style={[
                                        styles.optionName,
                                        !option.available && styles.optionNameDisabled
                                    ]}>
                                        {option.name}
                                    </Text>
                                    <Text style={[
                                        styles.optionPrice,
                                        !option.available && styles.optionPriceDisabled
                                    ]}>
                                        {option.price}
                                    </Text>
                                </View>
                                {!option.available && (
                                    <Text style={styles.unavailableText}>Unavailable</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Spacer for bottom button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add to Cart Button */}
            <View style={styles.bottomButton}>
                <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={addToCart}
                >
                    <Text style={styles.addToCartText}>
                        Add to Basket - {calculateTotalPrice()}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    cartButton: {
        padding: 8,
    },
    cartBadge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#CA0606',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    productImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    basePrice: {
        fontSize: 18,
        color: '#CA0606',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    optionGroup: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionGroupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    optionGroupSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    optionItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
        padding: 15,
    },
    optionItemDisabled: {
        opacity: 0.5,
    },
    optionItemSelected: {
        borderColor: '#CA0606',
        backgroundColor: '#FFF0F0',
    },
    optionItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionName: {
        fontSize: 14,
        fontWeight: '500',
    },
    optionNameDisabled: {
        color: '#999',
    },
    optionPrice: {
        fontSize: 14,
        color: '#CA0606',
        fontWeight: '500',
    },
    optionPriceDisabled: {
        color: '#999',
    },
    unavailableText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    bottomButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addToCartButton: {
        backgroundColor: '#CA0606',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 