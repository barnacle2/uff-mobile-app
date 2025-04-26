import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalSales: 0,
        todaySales: 0,
        averageRating: 0,
        totalRatings: 0
    });

    const [recentRatings, setRecentRatings] = useState([
        {
            id: 1,
            customerName: 'John Doe',
            rating: 5,
            comment: 'Great service and delicious food!',
            date: '2024-03-15'
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            rating: 4,
            comment: 'Food was good but delivery was a bit late',
            date: '2024-03-14'
        }
    ]);

    useEffect(() => {
        // Fetch merchant stats
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app, fetch from your backend
            setStats({
                totalOrders: 150,
                pendingOrders: 5,
                totalSales: 25000,
                todaySales: 1200,
                averageRating: 4.5,
                totalRatings: 120
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => router.replace('../../login') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Merchant Dashboard</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="receipt-outline" size={24} color="#CA0606" />
                        <Text style={styles.statValue}>{stats.totalOrders}</Text>
                        <Text style={styles.statLabel}>Total Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="time-outline" size={24} color="#CA0606" />
                        <Text style={styles.statValue}>{stats.pendingOrders}</Text>
                        <Text style={styles.statLabel}>Pending Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="cash-outline" size={24} color="#CA0606" />
                        <Text style={styles.statValue}>₱{stats.totalSales}</Text>
                        <Text style={styles.statLabel}>Total Sales</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="today-outline" size={24} color="#CA0606" />
                        <Text style={styles.statValue}>₱{stats.todaySales}</Text>
                        <Text style={styles.statLabel}>Today's Sales</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('../merchant/products')}
                        >
                            <Ionicons name="fast-food-outline" size={24} color="#CA0606" />
                            <Text style={styles.actionText}>Manage Products</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('../merchant/orders')}
                        >
                            <Ionicons name="list-outline" size={24} color="#CA0606" />
                            <Text style={styles.actionText}>View Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('../merchant/reports')}
                        >
                            <Ionicons name="bar-chart-outline" size={24} color="#CA0606" />
                            <Text style={styles.actionText}>Sales Reports</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => router.push('../merchant/profile')}
                        >
                            <Ionicons name="person-outline" size={24} color="#CA0606" />
                            <Text style={styles.actionText}>Business Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Orders */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    <View style={styles.orderList}>
                        {/* Sample order items */}
                        <View style={styles.orderItem}>
                            <View style={styles.orderInfo}>
                                <Text style={styles.orderId}>Order #12345</Text>
                                <Text style={styles.orderTime}>2 hours ago</Text>
                            </View>
                            <Text style={styles.orderAmount}>₱250.00</Text>
                        </View>
                        <View style={styles.orderItem}>
                            <View style={styles.orderInfo}>
                                <Text style={styles.orderId}>Order #12344</Text>
                                <Text style={styles.orderTime}>3 hours ago</Text>
                            </View>
                            <Text style={styles.orderAmount}>₱180.00</Text>
                        </View>
                    </View>
                </View>

                {/* Customer Reviews */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Customer Reviews</Text>
                        <TouchableOpacity onPress={() => router.push('../merchant/reviews')}>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.reviewOverview}>
                        <View style={styles.ratingScore}>
                            <Text style={styles.ratingNumber}>{stats.averageRating}</Text>
                            <View style={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < Math.floor(stats.averageRating) ? 'star' : 'star-outline'}
                                        size={20}
                                        color="#FFD700"
                                    />
                                ))}
                            </View>
                            <Text style={styles.ratingCount}>{stats.totalRatings} reviews</Text>
                        </View>
                    </View>

                    <View style={styles.recentReviews}>
                        {recentRatings.map((review) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.customerName}>{review.customerName}</Text>
                                    <View style={styles.ratingStars}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < review.rating ? 'star' : 'star-outline'}
                                                size={16}
                                                color="#FFD700"
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.reviewComment}>{review.comment}</Text>
                                <Text style={styles.reviewDate}>{review.date}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('../merchant/dashboard')}>
                    <Ionicons name="home-outline" size={24} color="#333" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('../merchant/orders')}>
                    <Ionicons name="list-outline" size={24} color="#333" />
                    <Text style={styles.navText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('../merchant/reports')}>
                    <Ionicons name="bar-chart-outline" size={24} color="#333" />
                    <Text style={styles.navText}>Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('../merchant/profile')}>
                    <Ionicons name="person-outline" size={24} color="#333" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
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
        padding: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    orderList: {
        gap: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
    },
    orderTime: {
        fontSize: 14,
        color: '#666',
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#CA0606',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    navItem: {
        alignItems: 'center',
        padding: 5,
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
    },
    reviewOverview: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    ratingScore: {
        alignItems: 'center',
    },
    ratingNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
    },
    stars: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    ratingCount: {
        fontSize: 14,
        color: '#666',
    },
    recentReviews: {
        gap: 10,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    ratingStars: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#CA0606',
    },
}); 