import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            // In a real app, implement Google OAuth here
            const mockUserData = {
                id: 'g-' + Date.now(),
                name: 'Google User',
                email: 'user@gmail.com',
                photo: null
            };
            await AsyncStorage.setItem('userToken', 'google-token');
            await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
            router.replace('/profile');
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // In a real app, implement Facebook OAuth here
            const mockUserData = {
                id: 'fb-' + Date.now(),
                name: 'Facebook User',
                email: 'user@facebook.com',
                photo: null
            };
            await AsyncStorage.setItem('userToken', 'facebook-token');
            await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
            router.replace('/profile');
        } catch (error) {
            console.error('Facebook login error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Image 
                    source={require('../assets/images/uff-logo.png')} 
                    style={styles.mascot}
                />

                <Text style={styles.title}>Sign up or Log in</Text>
                <Text style={styles.subtitle}>Select your preferred method to continue</Text>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.googleButton]}
                    onPress={handleGoogleLogin}
                >
                    <Image 
                        source={require('../assets/images/google-icon.png')} 
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.facebookButton]}
                    onPress={handleFacebookLogin}
                >
                    <Image 
                        source={require('../assets/images/facebook-icon.png')} 
                        style={styles.socialIcon}
                    />
                    <Text style={[styles.socialButtonText, styles.facebookButtonText]}>
                        Continue with Facebook
                    </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.emailButton]}
                    onPress={() => router.push('/email-login')}
                >
                    <Ionicons name="mail-outline" size={24} color="#333" />
                    <Text style={styles.socialButtonText}>Continue with email</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms and Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
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
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    mascot: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    googleButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    emailButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    socialButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    facebookButtonText: {
        color: '#fff',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
        fontSize: 14,
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 40,
    },
    termsLink: {
        color: '#333',
        textDecorationLine: 'underline',
    },
}); 