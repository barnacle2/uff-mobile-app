import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmailLoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        try {
            if (!email || !password) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            if (!validateEmail(email)) {
                Alert.alert('Error', 'Please enter a valid email address');
                return;
            }

            if (!isLogin) {
                if (!name) {
                    Alert.alert('Error', 'Please enter your name');
                    return;
                }
                if (password !== confirmPassword) {
                    Alert.alert('Error', 'Passwords do not match');
                    return;
                }
                if (password.length < 6) {
                    Alert.alert('Error', 'Password must be at least 6 characters');
                    return;
                }
            }

            // In a real app, make API call here
            const userData = {
                id: Date.now().toString(),
                name: isLogin ? 'User' : name,
                email,
                phone: '',
                address: ''
            };

            await AsyncStorage.setItem('userToken', 'email-token');
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            router.replace('/profile');
        } catch (error) {
            console.error('Authentication error:', error);
            Alert.alert('Error', 'Authentication failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>
                    {isLogin ? 'Welcome back!' : 'Create account'}
                </Text>
                <Text style={styles.subtitle}>
                    {isLogin 
                        ? 'Sign in to continue' 
                        : 'Fill in your details to get started'
                    }
                </Text>

                {!isLogin && (
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showPasswordButton}
                    >
                        <Ionicons 
                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color="#666" 
                        />
                    </TouchableOpacity>
                </View>

                {!isLogin && (
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.showPasswordButton}
                        >
                            <Ionicons 
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {isLogin && (
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    </Text>
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.switchLink}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    showPasswordButton: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#CA0606',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    switchText: {
        fontSize: 14,
        color: '#666',
    },
    switchLink: {
        fontSize: 14,
        color: '#CA0606',
        fontWeight: 'bold',
    },
}); 