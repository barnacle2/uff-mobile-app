import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Reviews() {
    const router = useRouter();
    const [reviews] = useState([
        {
            id: 1,
            customerName: 'John Doe',
            rating: 5,
            comment: 'Great service and delicious food! The delivery was fast and the packaging was perfect.',
            date: '2024-03-15',
            orderId: 'ORD-12345',
            items: ['Chicken Joy', 'Jolly Spaghetti']
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            rating: 4,
            comment: 'Food was good but delivery was a bit late. The chicken was still crispy though!',
            date: '2024-03-14',
            orderId: 'ORD-12344',
            items: ['Chicken Joy', 'Burger Steak']
        },
        {
            id: 3,
            customerName: 'Mike Johnson',
            rating: 5,
            comment: 'Excellent quality and fast delivery. Will definitely order again!',
            date: '2024-03-13',
            orderId: 'ORD-12343',
            items: ['Yum Burger', 'Fries']
        },
        {
            id: 4,
            customerName: 'Sarah Wilson',
            rating: 3,
            comment: 'Food was okay, but packaging could be better. Some items were slightly cold.',
            date: '2024-03-12',
            orderId: 'ORD-12342',
            items: ['Chicken Sandwich', 'Pie']
        }
    ]);

    const [filter, setFilter] = useState('all');

    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        return review.rating === parseInt(filter);
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customer Reviews</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
                </TouchableOpacity>
                {[5, 4, 3, 2, 1].map((star) => (
                    <TouchableOpacity 
                        key={star}
                        style={[styles.filterButton, filter === star.toString() && styles.activeFilter]}
                        onPress={() => setFilter(star.toString())}
                    >
                        <Text style={[styles.filterText, filter === star.toString() && styles.activeFilterText]}>
                            {star} Stars
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {filteredReviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View>
                                <Text style={styles.customerName}>{review.customerName}</Text>
                                <Text style={styles.orderId}>Order #{review.orderId}</Text>
                            </View>
                            <View style={styles.ratingStars}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < review.rating ? 'star' : 'star-outline'}
                                        size={20}
                                        color="#FFD700"
                                    />
                                ))}
                            </View>
                        </View>
                        <View style={styles.orderItems}>
                            <Text style={styles.orderItemsLabel}>Ordered Items:</Text>
                            <Text style={styles.orderItemsList}>{review.items.join(', ')}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                ))}
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
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginHorizontal: 4,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    activeFilter: {
        backgroundColor: '#CA0606',
        borderColor: '#CA0606',
    },
    filterText: {
        fontSize: 12,
        color: '#666',
    },
    activeFilterText: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    orderId: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    ratingStars: {
        flexDirection: 'row',
    },
    orderItems: {
        marginBottom: 8,
    },
    orderItemsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    orderItemsList: {
        fontSize: 14,
        color: '#666',
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
}); 