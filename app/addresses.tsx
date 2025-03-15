import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [newAddress, setNewAddress] = useState<Address>({
        id: '',
        label: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const savedAddresses = await AsyncStorage.getItem('addresses');
            if (savedAddresses) {
                setAddresses(JSON.parse(savedAddresses));
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const saveAddresses = async (newAddresses: Address[]) => {
        try {
            await AsyncStorage.setItem('addresses', JSON.stringify(newAddresses));
            setAddresses(newAddresses);
        } catch (error) {
            console.error('Error saving addresses:', error);
        }
    };

    const handleAddAddress = () => {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const addressToAdd = {
            ...newAddress,
            id: Date.now().toString(),
            isDefault: addresses.length === 0
        };

        const updatedAddresses = [...addresses, addressToAdd];
        saveAddresses(updatedAddresses);
        setIsAdding(false);
        setNewAddress({
            id: '',
            label: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        });
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setNewAddress(address);
        setIsAdding(true);
    };

    const handleUpdateAddress = () => {
        if (!editingAddress) return;

        const updatedAddresses = addresses.map(addr => 
            addr.id === editingAddress.id ? newAddress : addr
        );
        saveAddresses(updatedAddresses);
        setIsAdding(false);
        setEditingAddress(null);
        setNewAddress({
            id: '',
            label: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        });
    };

    const handleDeleteAddress = (addressId: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
                        saveAddresses(updatedAddresses);
                    }
                }
            ]
        );
    };

    const handleSetDefault = (addressId: string) => {
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));
        saveAddresses(updatedAddresses);
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
                <Text style={styles.headerTitle}>Delivery Addresses</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setIsAdding(true)}
                >
                    <Ionicons name="add" size={24} color="#CA0606" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {isAdding ? (
                    <View style={styles.addressForm}>
                        <TextInput
                            style={styles.input}
                            placeholder="Label (e.g., Home, Work)"
                            value={newAddress.label}
                            onChangeText={(text) => setNewAddress({...newAddress, label: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Street Address"
                            value={newAddress.street}
                            onChangeText={(text) => setNewAddress({...newAddress, street: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={newAddress.city}
                            onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={newAddress.state}
                            onChangeText={(text) => setNewAddress({...newAddress, state: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ZIP Code"
                            value={newAddress.zipCode}
                            onChangeText={(text) => setNewAddress({...newAddress, zipCode: text})}
                            keyboardType="numeric"
                        />
                        <View style={styles.formButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setIsAdding(false);
                                    setEditingAddress(null);
                                    setNewAddress({
                                        id: '',
                                        label: '',
                                        street: '',
                                        city: '',
                                        state: '',
                                        zipCode: '',
                                        isDefault: false
                                    });
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={editingAddress ? handleUpdateAddress : handleAddAddress}
                            >
                                <Text style={[styles.buttonText, styles.saveButtonText]}>
                                    {editingAddress ? 'Update' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View key={address.id} style={styles.addressCard}>
                            <View style={styles.addressHeader}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>{address.label || 'Address'}</Text>
                                    {address.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        onPress={() => handleEditAddress(address)}
                                        style={styles.actionButton}
                                    >
                                        <Ionicons name="pencil" size={20} color="#666" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteAddress(address.id)}
                                        style={styles.actionButton}
                                    >
                                        <Ionicons name="trash" size={20} color="#CA0606" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.addressText}>{address.street}</Text>
                            <Text style={styles.addressText}>
                                {address.city}, {address.state} {address.zipCode}
                            </Text>
                            {!address.isDefault && (
                                <TouchableOpacity
                                    style={styles.setDefaultButton}
                                    onPress={() => handleSetDefault(address.id)}
                                >
                                    <Text style={styles.setDefaultText}>Set as Default</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    addButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    addressCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    defaultBadge: {
        backgroundColor: '#CA0606',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    defaultText: {
        color: '#fff',
        fontSize: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 5,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    setDefaultButton: {
        marginTop: 10,
    },
    setDefaultText: {
        color: '#CA0606',
        fontSize: 14,
    },
    addressForm: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#CA0606',
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
    },
}); 