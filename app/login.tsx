import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
    const router = useRouter();

    const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
        clientId: '412623744712-vrfmkhalmadb4ufl94o0bpqm7l8pjqft.apps.googleusercontent.com',
        androidClientId: '412623744712-vrfmkhalmadb4ufl94o0bpqm7l8pjqft.apps.googleusercontent.com',
        iosClientId: '412623744712-vrfmkhalmadb4ufl94o0bpqm7l8pjqft.apps.googleusercontent.com',
        scopes: ['profile', 'email']
    });

    const [fbRequest, fbResponse, promptFacebookAsync] = Facebook.useAuthRequest({
        clientId: 'YOUR_FACEBOOK_APP_ID',
    });

    useEffect(() => {
        handleAuthResponse(googleResponse, 'google');
    }, [googleResponse]);

    useEffect(() => {
        handleAuthResponse(fbResponse, 'facebook');
    }, [fbResponse]);

    const handleAuthResponse = async (response: any, provider: string) => {
        if (response?.type === 'success') {
            const { authentication } = response;
            
            try {
                // Send token to your backend
                const result = await fetch(`http://localhost:5000/auth/${provider}/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        access_token: authentication.accessToken 
                    }),
                });

                const data = await result.json();
                
                // Store the JWT token
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
                
                // Navigate to main app
                router.replace('/');
            } catch (error) {
                console.error('Authentication error:', error);
                alert('Authentication failed. Please try again.');
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await promptGoogleAsync();
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await promptFacebookAsync();
        } catch (error) {
            console.error('Facebook login error:', error);
        }
    };

    const handleEmailLogin = () => {
        router.push('/email-login');
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
                <Image
                    source={require('../assets/images/uff-logo.png')}
                    style={styles.mascot}
                />
                
                <Text style={styles.title}>Welcome to FastFood</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.googleButton]}
                    onPress={handleGoogleLogin}
                >
                    <Ionicons name="logo-google" size={24} color="#EA4335" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.facebookButton]}
                    onPress={handleFacebookLogin}
                >
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                    <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                    style={[styles.socialButton, styles.emailButton]}
                    onPress={handleEmailLogin}
                >
                    <Ionicons name="mail" size={24} color="#333" />
                    <Text style={styles.socialButtonText}>Continue with Email</Text>
                </TouchableOpacity>

                <Text style={styles.terms}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
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
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    mascot: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleButton: {
        backgroundColor: '#fff',
    },
    facebookButton: {
        backgroundColor: '#fff',
    },
    emailButton: {
        backgroundColor: '#fff',
    },
    socialButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
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
    },
    terms: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    termsLink: {
        color: '#CA0606',
    },
}); 