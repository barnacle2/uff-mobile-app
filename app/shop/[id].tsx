import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample data - We'll move this to a proper data file later
export const shopData = {
    'jollibee': {
        name: 'Jollibee',
        logo: require('../../assets/images/shops/jollibee logo1.png'),
        rating: 4.8,
        deliveryTime: '20-30 min',
        description: 'The Philippines\' largest fast-food chain brand. Bringing great tasting food to the Filipino people for over 40 years.',
        specialOffers: [
            'Free Delivery on orders above ₱500',
            'Get a FREE Peach Mango Pie on orders above ₱1000'
        ],
        categories: ['Chicken Joy', 'Burgers', 'Spaghetti', 'Rice Meals', 'Breakfast', 'Desserts'],
        popularItems: [
            {
                name: 'Chicken Joy',
                price: '₱89.00',
                image: require('../../assets/images/top picks/11.png'),
                description: 'Crispylicious, Juicylicious Chicken Joy'
            },
            {
                name: 'Jolly Spaghetti',
                price: '₱79.00',
                image: require('../../assets/images/top picks/6.png'),
                description: 'Sweet-style spaghetti with ground meat and hotdog'
            }
        ],
        distance: 0.8, // in kilometers
        popularity: 95 // popularity score out of 100
    },
    'mcdonalds': {
        name: "McDonald's",
        logo: require('../../assets/images/shops/mcdo logo.png'),
        rating: 4.7,
        deliveryTime: '15-25 min',
        description: 'Quality food, quick service, and friendly staff - all at McDonald\'s. Serving happiness to Filipinos since 1981.',
        specialOffers: [
            '₱50 OFF on orders above ₱500',
            'Free McFlurry on orders above ₱800'
        ],
        categories: ['Burgers', 'Chicken', 'Rice Meals', 'Breakfast', 'Desserts', 'Beverages'],
        popularItems: [
            {
                name: 'Big Mac',
                price: '₱169.00',
                image: require('../../assets/images/top picks/9.png'),
                description: 'Iconic burger with two all-beef patties'
            }
        ],
        distance: 1.2,
        popularity: 92
    },
    'greenwich': {
        name: 'Greenwich',
        logo: require('../../assets/images/shops/greenwichlogo.png'),
        rating: 4.6,
        deliveryTime: '25-35 min',
        description: 'The Philippines\' favorite pizza chain. Best pizza and pasta for sharing with family and friends.',
        specialOffers: [
            '20% OFF on all Pizzas every Monday',
            'Free Lasagna on orders above ₱1000'
        ],
        categories: ['Pizza', 'Pasta', 'Chicken', 'Rice Meals', 'Appetizers', 'Beverages'],
        popularItems: [
            {
                name: 'Hawaiian Overload',
                price: '₱299.00',
                image: require('../../assets/images/top picks/1.png'),
                description: 'Pizza loaded with ham, pineapple, and cheese'
            },
            {
                name: 'Lasagna Supreme',
                price: '₱129.00',
                image: require('../../assets/images/top picks/5.png'),
                description: 'Rich and creamy lasagna with meat sauce'
            }
        ],
        distance: 1.5,
        popularity: 88
    },
    'manginasal': {
        name: 'Mang Inasal',
        logo: require('../../assets/images/shops/manginasallogo.jpg'),
        rating: 4.5,
        deliveryTime: '20-30 min',
        description: 'Home of the best-tasting chicken inasal. Filipino favorite with unlimited rice.',
        specialOffers: [
            'Extra Unlimited Rice on all Chicken Meals',
            'Free Soup with every order'
        ],
        categories: ['Chicken Inasal', 'Paa', 'Pecho', 'Rice Meals', 'Soups', 'Beverages'],
        popularItems: [
            {
                name: 'Chicken Inasal Paa',
                price: '₱129.00',
                image: require('../../assets/images/top picks/10.png'),
                description: 'Grilled chicken leg quarter with unlimited rice'
            },
            {
                name: 'Chicken Inasal Pecho',
                price: '₱139.00',
                image: require('../../assets/images/top picks/11.png'),
                description: 'Grilled chicken breast with unlimited rice'
            }
        ],
        distance: 2.1,
        popularity: 85
    }
};

interface CartItem {
    id: string;
    name: string;
    price: string;
    image: any;
    quantity: number;
    restaurant: string;
}

export default function ShopPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const shop = shopData[id as keyof typeof shopData];
    const [cartItemCount, setCartItemCount] = useState(0);
    const badgeScale = new Animated.Value(1);

    // Load cart count on mount and when it changes
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

    const addToCart = async (item: any) => {
        try {
            const itemId = `${id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
            const savedCart = await AsyncStorage.getItem('cart');
            let cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
            
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
            
            if (existingItemIndex >= 0) {
                cart[existingItemIndex].quantity += 1;
                Alert.alert('Success', 'Item quantity updated in cart');
            } else {
                cart.push({
                    id: itemId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1,
                    restaurant: shop.name
                });
                Alert.alert('Success', 'Item added to cart');
            }
            
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            await loadCartCount();
            animateCartBadge();
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart');
        }
    };

    if (!shop) {
        return (
            <View style={styles.container}>
                <Text>Shop not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Background */}
            <View style={styles.headerBackground}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.cartButton}
                        onPress={() => router.push('/cart')}
                    >
                        <View>
                            <Ionicons name="cart-outline" size={24} color="#fff" />
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
                
                {/* Shop Info */}
                <View style={styles.shopInfo}>
                    <Image source={shop.logo} style={styles.shopLogo} />
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <View style={styles.shopStats}>
                        <View style={styles.stat}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.statText}>{shop.rating}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="time-outline" size={16} color="#fff" />
                            <Text style={styles.statText}>{shop.deliveryTime}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.description}>{shop.description}</Text>
                </View>

                {/* Special Offers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Special Offers</Text>
                    {shop.specialOffers.map((offer, index) => (
                        <View key={index} style={styles.offerCard}>
                            <Ionicons name="gift-outline" size={24} color="#CA0606" />
                            <Text style={styles.offerText}>{offer}</Text>
                        </View>
                    ))}
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                        {shop.categories.map((category, index) => (
                            <TouchableOpacity key={index} style={styles.categoryButton}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Popular Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Popular Items</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularItemsContainer}>
                        {shop.popularItems.map((item, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.popularItemCard}
                                onPress={() => {
                                    const itemId = `${id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
                                    router.push({
                                        pathname: "/product/[id]",
                                        params: { id: itemId }
                                    });
                                }}
                            >
                                <Image source={item.image} style={styles.itemImage} />
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>{item.price}</Text>
                                <Text style={styles.itemDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <TouchableOpacity 
                                    style={styles.addToCartButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                >
                                    <Ionicons name="cart-outline" size={20} color="#fff" />
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBackground: {
        backgroundColor: '#CA0606',
        paddingBottom: 20,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
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
        backgroundColor: '#fff',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#CA0606',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    shopInfo: {
        alignItems: 'center',
        padding: 20,
    },
    shopLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    shopName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    shopStats: {
        flexDirection: 'row',
        gap: 20,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statText: {
        color: '#fff',
        fontSize: 14,
    },
    section: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    offerText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    categoriesContainer: {
        flexDirection: 'row',
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    popularItemsContainer: {
        flexDirection: 'row',
    },
    popularItemCard: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 14,
        color: '#CA0606',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    addToCartButton: {
        backgroundColor: '#CA0606',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        gap: 5,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
}); 