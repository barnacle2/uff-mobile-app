import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Types for cart items
interface CartItem {
    id: string;
    name: string;
    price: string;
    image: any;
    quantity: number;
    restaurant: string;
    selectedOptions?: string[];
}

interface SavedItem extends CartItem {
    savedAt: string;
}

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [total, setTotal] = useState(0);

    // Load cart items from storage
    useEffect(() => {
        loadCart();
        loadSavedItems();
    }, []);

    // Calculate total price whenever cart items change
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

    const loadSavedItems = async () => {
        try {
            const saved = await AsyncStorage.getItem('savedItems');
            if (saved) {
                setSavedItems(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading saved items:', error);
        }
    };

    const calculateTotal = () => {
        const sum = cartItems.reduce((total, item) => {
            return total + (parseFloat(item.price.replace('₱', '')) * item.quantity);
        }, 0);
        setTotal(sum);
    };

    const updateCart = async (newCart: CartItem[]) => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
            setCartItems(newCart);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const updateSavedItems = async (newSavedItems: SavedItem[]) => {
        try {
            await AsyncStorage.setItem('savedItems', JSON.stringify(newSavedItems));
            setSavedItems(newSavedItems);
        } catch (error) {
            console.error('Error updating saved items:', error);
        }
    };

    const removeFromCart = async (itemId: string) => {
        const newCart = cartItems.filter(item => item.id !== itemId);
        await updateCart(newCart);
    };

    const updateQuantity = async (itemId: string, change: number) => {
        const newCart = cartItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = item.quantity + change;
                if (newQuantity < 1) return item;
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        await updateCart(newCart);
    };

    const saveForLater = async (item: CartItem) => {
        try {
            // Remove from cart
            await removeFromCart(item.id);
            
            // Add to saved items
            const savedItem: SavedItem = {
                ...item,
                savedAt: new Date().toISOString()
            };
            const newSavedItems = [...savedItems, savedItem];
            await updateSavedItems(newSavedItems);
            
            Alert.alert('Success', 'Item saved for later');
        } catch (error) {
            console.error('Error saving item for later:', error);
            Alert.alert('Error', 'Failed to save item for later');
        }
    };

    const moveToCart = async (savedItem: SavedItem) => {
        try {
            // Remove from saved items
            const newSavedItems = savedItems.filter(item => item.id !== savedItem.id);
            await updateSavedItems(newSavedItems);
            
            // Add to cart
            const cartItem: CartItem = {
                id: savedItem.id,
                name: savedItem.name,
                price: savedItem.price,
                image: savedItem.image,
                quantity: 1,
                restaurant: savedItem.restaurant,
                selectedOptions: savedItem.selectedOptions
            };
            const newCart = [...cartItems, cartItem];
            await updateCart(newCart);
            
            Alert.alert('Success', 'Item moved to cart');
        } catch (error) {
            console.error('Error moving item to cart:', error);
            Alert.alert('Error', 'Failed to move item to cart');
        }
    };

    const addToFavorites = async (item: CartItem) => {
        try {
            const savedFavorites = await AsyncStorage.getItem('favorites');
            let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
            
            // Check if already in favorites
            if (favorites.some((fav: CartItem) => fav.id === item.id)) {
                Alert.alert('Info', 'Item is already in favorites');
                return;
            }
            
            favorites.push(item);
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            Alert.alert('Success', 'Item added to favorites');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            Alert.alert('Error', 'Failed to add item to favorites');
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
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity 
                    style={styles.favoritesButton}
                    onPress={() => router.push('/favorites')}
                >
                    <Ionicons name="heart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Cart Items</Text>
                        {cartItems.map((item, index) => (
                            <View key={index} style={styles.itemCard}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                    
                                    <View style={styles.itemActions}>
                                        <View style={styles.quantityControls}>
                                            <TouchableOpacity 
                                                style={styles.quantityButton}
                                                onPress={() => updateQuantity(item.id, -1)}
                                            >
                                                <Ionicons name="remove" size={20} color="#CA0606" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantity}>{item.quantity}</Text>
                                            <TouchableOpacity 
                                                style={styles.quantityButton}
                                                onPress={() => updateQuantity(item.id, 1)}
                                            >
                                                <Ionicons name="add" size={20} color="#CA0606" />
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={styles.itemButtons}>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => saveForLater(item)}
                                            >
                                                <Ionicons name="bookmark-outline" size={20} color="#666" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => addToFavorites(item)}
                                            >
                                                <Ionicons name="heart-outline" size={20} color="#666" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.iconButton}
                                                onPress={() => removeFromCart(item.id)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#666" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="cart-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>Your cart is empty</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Add items to your cart to start ordering
                        </Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Saved Items */}
                {savedItems.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Saved for Later</Text>
                        {savedItems.map((item, index) => (
                            <View key={index} style={styles.itemCard}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                                    <Text style={styles.itemPrice}>{item.price}</Text>
                                    
                                    <View style={styles.savedItemActions}>
                                        <TouchableOpacity
                                            style={styles.moveToCartButton}
                                            onPress={() => moveToCart(item)}
                                        >
                                            <Ionicons name="cart-outline" size={20} color="#fff" />
                                            <Text style={styles.moveToCartText}>Move to Cart</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.iconButton}
                                            onPress={() => {
                                                const newSavedItems = savedItems.filter(
                                                    savedItem => savedItem.id !== item.id
                                                );
                                                updateSavedItems(newSavedItems);
                                            }}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Checkout Button */}
            {cartItems.length > 0 && (
                <View style={styles.bottomButton}>
                    <TouchableOpacity 
                        style={styles.checkoutButton}
                        onPress={() => router.push('/checkout')}
                    >
                        <Text style={styles.checkoutButtonText}>
                            Checkout - ₱{total.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
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
    favoritesButton: {
        padding: 8,
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
    itemCard: {
        flexDirection: 'row',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 10,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemRestaurant: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#CA0606',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemActions: {
        flexDirection: 'column',
        gap: 10,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    quantityButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#CA0606',
        borderRadius: 5,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'center',
    },
    itemButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    iconButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
    },
    savedItemActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    moveToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CA0606',
        padding: 8,
        borderRadius: 5,
        gap: 5,
    },
    moveToCartText: {
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
}); 