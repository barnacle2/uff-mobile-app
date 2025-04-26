import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        businessName: '',
        businessType: '',
        businessAddress: '',
        phoneNumber: ''
    });

    const handleRegister = async () => {
        try {
            // Validate form data
            if (!formData.email || !formData.fullName || !formData.businessName || 
                !formData.businessType || !formData.businessAddress || !formData.phoneNumber) {
                Alert.alert('Error', 'Please fill in all fields');
                return;
            }

            // In a real app, send to your backend
            // For now, we'll simulate a successful registration
            Alert.alert(
                'Success',
                'Registration successful! Please wait for account verification.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('../merchant/dashboard')
                    }
                ]
            );
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Merchant Registration</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.subtitle}>Create your business account</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChangeText={(text) => setFormData({...formData, fullName: text})}
                    />

                    <Text style={styles.label}>Business Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChangeText={(text) => setFormData({...formData, businessName: text})}
                    />

                    <Text style={styles.label}>Business Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Restaurant, Cafe, etc."
                        value={formData.businessType}
                        onChangeText={(text) => setFormData({...formData, businessType: text})}
                    />

                    <Text style={styles.label}>Business Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter business address"
                        value={formData.businessAddress}
                        onChangeText={(text) => setFormData({...formData, businessAddress: text})}
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                        keyboardType="phone-pad"
                    />

                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
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
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
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
    registerButton: {
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 