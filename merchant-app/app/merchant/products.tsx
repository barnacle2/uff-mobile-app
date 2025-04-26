import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
}

export default function ProductManagement() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // In a real app, fetch from your backend
            setProducts([
                {
                    id: '1',
                    name: 'Chicken Joy',
                    description: 'Crispy fried chicken with rice',
                    price: 99,
                    category: 'Meals',
                    image: 'https://example.com/chicken-joy.jpg',
                    isAvailable: true
                },
                {
                    id: '2',
                    name: 'Jolly Spaghetti',
                    description: 'Sweet-style spaghetti with hotdog',
                    price: 75,
                    category: 'Pasta',
                    image: 'https://example.com/spaghetti.jpg',
                    isAvailable: true
                }
            ]);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = async () => {
        try {
            // In a real app, send to your backend
            const product: Product = {
                id: Date.now().toString(),
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                image: newProduct.image,
                isAvailable: true
            };

            setProducts([...products, product]);
            setIsAddingProduct(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                category: '',
                image: ''
            });

            Alert.alert('Success', 'Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            Alert.alert('Error', 'Failed to add product');
        }
    };

    const toggleProductAvailability = async (productId: string) => {
        try {
            // In a real app, update in your backend
            setProducts(products.map(product => 
                product.id === productId 
                    ? { ...product, isAvailable: !product.isAvailable }
                    : product
            ));
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Products</Text>
                <TouchableOpacity onPress={() => setIsAddingProduct(true)}>
                    <Ionicons name="add-circle-outline" size={24} color="#CA0606" />
                </TouchableOpacity>
            </View>

            {isAddingProduct ? (
                <ScrollView style={styles.content}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Product Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product name"
                            value={newProduct.name}
                            onChangeText={(text) => setNewProduct({...newProduct, name: text})}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter product description"
                            value={newProduct.description}
                            onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                            multiline
                            numberOfLines={3}
                        />

                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter price"
                            value={newProduct.price}
                            onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter category"
                            value={newProduct.category}
                            onChangeText={(text) => setNewProduct({...newProduct, category: text})}
                        />

                        <Text style={styles.label}>Image URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter image URL"
                            value={newProduct.image}
                            onChangeText={(text) => setNewProduct({...newProduct, image: text})}
                        />

                        <TouchableOpacity 
                            style={styles.submitButton}
                            onPress={handleAddProduct}
                        >
                            <Text style={styles.submitButtonText}>Add Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setIsAddingProduct(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={styles.content}>
                    {products.map(product => (
                        <View key={product.id} style={styles.productCard}>
                            <Image 
                                source={{ uri: product.image }} 
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productDescription}>{product.description}</Text>
                                <Text style={styles.productPrice}>₱{product.price}</Text>
                                <Text style={styles.productCategory}>{product.category}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[
                                    styles.availabilityButton,
                                    product.isAvailable ? styles.available : styles.unavailable
                                ]}
                                onPress={() => toggleProductAvailability(product.id)}
                            >
                                <Text style={styles.availabilityText}>
                                    {product.isAvailable ? 'Available' : 'Unavailable'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    form: {
        gap: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 15,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#CA0606',
        marginTop: 5,
    },
    productCategory: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    availabilityButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    available: {
        backgroundColor: '#E8F5E9',
    },
    unavailable: {
        backgroundColor: '#FFEBEE',
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
    },
}); 