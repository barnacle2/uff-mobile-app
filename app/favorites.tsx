import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteItem {
    id: string;
    name: string;
    price: string;
    image: any;
    description: string;
    restaurant: string;
}

export default function FavoritesPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem('favorites');
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const removeFromFavorites = async (itemId: string) => {
        try {
            const updatedFavorites = favorites.filter(item => item.id !== itemId);
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            Alert.alert('Success', 'Item removed from favorites');
        } catch (error) {
            console.error('Error removing from favorites:', error);
            Alert.alert('Error', 'Failed to remove item from favorites');
        }
    };

    const addToCart = async (item: FavoriteItem) => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            let cart = savedCart ? JSON.parse(savedCart) : [];
            
            const cartItem = {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
                restaurant: item.restaurant
            };
            
            cart.push(cartItem);
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            Alert.alert('Success', 'Item added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            Alert.alert('Error', 'Failed to add item to cart');
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
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={{ width: 40 }} /> {/* Spacer for alignment */}
            </View>

            {/* Favorites List */}
            <ScrollView style={styles.content}>
                {favorites.length > 0 ? (
                    favorites.map((item, index) => (
                        <View key={index} style={styles.itemCard}>
                            <TouchableOpacity
                                onPress={() => router.push({
                                    pathname: "/product/[id]",
                                    params: { id: item.id }
                                })}
                            >
                                <Image source={item.image} style={styles.itemImage} />
                            </TouchableOpacity>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                                <Text style={styles.itemPrice}>{item.price}</Text>
                                <View style={styles.itemActions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => addToCart(item)}
                                    >
                                        <Ionicons name="cart-outline" size={20} color="#fff" />
                                        <Text style={styles.actionButtonText}>Add to Cart</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.removeButton]}
                                        onPress={() => removeFromFavorites(item.id)}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#fff" />
                                        <Text style={styles.actionButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="heart-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>No favorites yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Items you favorite will appear here
                        </Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
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
    itemCard: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
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
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CA0606',
        padding: 8,
        borderRadius: 8,
        gap: 5,
    },
    removeButton: {
        backgroundColor: '#666',
    },
    actionButtonText: {
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