import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image 
                    source={require('../assets/uff-logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Welcome to UFF Merchant</Text>
                <Text style={styles.subtitle}>Manage your business, track orders, and grow your sales</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/register')}
                    >
                        <Text style={styles.buttonText}>Register as Merchant</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.outlineButton]}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={[styles.buttonText, styles.outlineButtonText]}>Login</Text>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
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
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        backgroundColor: '#CA0606',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#CA0606',
    },
    outlineButtonText: {
        color: '#CA0606',
    },
}); 