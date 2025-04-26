import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    profileImage?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            if (userToken && userData) {
                setIsLoggedIn(true);
                setProfile(JSON.parse(userData));
                setEditedProfile(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleRegister = () => {
        router.push('/register');
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            setIsLoggedIn(false);
            setProfile(null);
            Alert.alert('Success', 'You have been logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Failed to log out');
        }
    };

    const handleSaveProfile = async () => {
        if (!editedProfile) return;

        try {
            await AsyncStorage.setItem('userData', JSON.stringify(editedProfile));
            setProfile(editedProfile);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const ProfileSection = () => (
        <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={profile?.profileImage ? { uri: profile.profileImage } : require('../assets/images/default-profile.png')}
                        style={styles.profileImage}
                    />
                    {isEditing && (
                        <TouchableOpacity style={styles.editImageButton}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.profileName}>{profile?.name || 'User Name'}</Text>
                <Text style={styles.profileEmail}>{profile?.email || 'email@example.com'}</Text>
            </View>

            {isEditing ? (
                <View style={styles.editForm}>
                    <TextInput
                        style={styles.input}
                        value={editedProfile?.name}
                        onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, name: text} : null)}
                        placeholder="Name"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedProfile?.phone}
                        onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, phone: text} : null)}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={editedProfile?.address}
                        onChangeText={(text) => setEditedProfile(prev => prev ? {...prev, address: text} : null)}
                        placeholder="Address"
                        multiline
                        numberOfLines={3}
                    />
                    <View style={styles.editButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => setIsEditing(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSaveProfile}
                        >
                            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.profileInfo}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Ionicons name="pencil" size={20} color="#666" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <View style={styles.infoItem}>
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{profile?.phone || 'Add phone number'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>{profile?.address || 'Add address'}</Text>
                    </View>
                </View>
            )}

            <View style={styles.menuSection}>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => router.push('/orders')}
                >
                    <Ionicons name="receipt-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Order History</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => router.push('/favorites')}
                >
                    <Ionicons name="heart-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Favorites</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => router.push('/addresses')}
                >
                    <Ionicons name="location-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Saved Addresses</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => router.push('/payment-methods')}
                >
                    <Ionicons name="card-outline" size={24} color="#333" />
                    <Text style={styles.menuItemText}>Payment Methods</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={24} color="#CA0606" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    const AuthSection = () => (
        <View style={styles.authSection}>
            <Image
                source={require('../assets/images/auth-banner.png')}
                style={styles.authBanner}
            />
            <Text style={styles.authTitle}>Welcome to Universal Fast Food</Text>
            <Text style={styles.authSubtitle}>
                Sign in to access your profile, track orders, and more
            </Text>
            <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={handleLogin}
            >
                <Text style={[styles.buttonText, styles.loginButtonText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.registerButton]}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {isLoggedIn ? <ProfileSection /> : <AuthSection />}
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
    profileSection: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editImageButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#CA0606',
        padding: 8,
        borderRadius: 15,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    profileInfo: {
        marginTop: 20,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 15,
    },
    editButtonText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 14,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    editForm: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    menuSection: {
        marginTop: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CA0606',
        gap: 10,
    },
    logoutButtonText: {
        color: '#CA0606',
        fontSize: 16,
        fontWeight: 'bold',
    },
    authSection: {
        padding: 20,
        alignItems: 'center',
    },
    authBanner: {
        width: '100%',
        height: 200,
        marginBottom: 30,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    authSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#CA0606',
    },
    loginButtonText: {
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#CA0606',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    saveButton: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#CA0606',
    },
    saveButtonText: {
        color: '#fff',
    },
}); 