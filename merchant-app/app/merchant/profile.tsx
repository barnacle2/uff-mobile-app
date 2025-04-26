import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BusinessProfile {
    email: string;
    fullName: string;
    businessName: string;
    businessType: string;
    businessAddress: string;
    phoneNumber: string;
    logo: string;
    isVerified: boolean;
    rating: number;
    totalOrders: number;
    memberSince: string;
}

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<BusinessProfile>({
        email: 'jollibeemb@gmail.com',
        fullName: 'Jollibee Main Branch',
        businessName: 'Jollibee',
        businessType: 'Restaurant',
        businessAddress: 'Sungao Highway',
        phoneNumber: '09098855469',
        logo: 'https://example.com/jollibee-logo.png',
        isVerified: true,
        rating: 4.8,
        totalOrders: 1500,
        memberSince: '2024-01-01'
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    const handleSave = async () => {
        try {
            // In a real app, send to your backend
            setProfile(editedProfile);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Business Profile</Text>
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    <Ionicons 
                        name={isEditing ? "checkmark" : "create-outline"} 
                        size={24} 
                        color="#CA0606" 
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: profile.logo }}
                        style={styles.logo}
                    />
                    <View style={styles.businessInfo}>
                        <Text style={styles.businessName}>{profile.businessName}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#43A047" />
                            <Text style={styles.verifiedText}>Verified Business</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile.rating}</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile.totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {new Date(profile.memberSince).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                            })}
                        </Text>
                        <Text style={styles.statLabel}>Member Since</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Information</Text>
                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={editedProfile.email}
                            onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={editedProfile.fullName}
                            onChangeText={(text) => setEditedProfile({...editedProfile, fullName: text})}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Business Type</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={editedProfile.businessType}
                            onChangeText={(text) => setEditedProfile({...editedProfile, businessType: text})}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Business Address</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={editedProfile.businessAddress}
                            onChangeText={(text) => setEditedProfile({...editedProfile, businessAddress: text})}
                            editable={isEditing}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={editedProfile.phoneNumber}
                            onChangeText={(text) => setEditedProfile({...editedProfile, phoneNumber: text})}
                            editable={isEditing}
                            keyboardType="phone-pad"
                        />
                    </View>
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    businessInfo: {
        alignItems: 'center',
    },
    businessName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    verifiedText: {
        color: '#43A047',
        marginLeft: 5,
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
    },
}); 