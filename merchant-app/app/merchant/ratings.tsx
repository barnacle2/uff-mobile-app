import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Ratings() {
    const router = useRouter();
    const [ratings] = useState([
        {
            id: 1,
            customerName: 'John Doe',
            rating: 5,
            comment: 'Great service and delicious food!',
            date: '2024-03-15',
            orderId: 'ORD-12345'
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            rating: 4,
            comment: 'Food was good but delivery was a bit late',
            date: '2024-03-14',
            orderId: 'ORD-12344'
        },
        {
            id: 3,
            customerName: 'Mike Johnson',
            rating: 5,
            comment: 'Excellent quality and fast delivery',
            date: '2024-03-13',
            orderId: 'ORD-12343'
        },
        {
            id: 4,
            customerName: 'Sarah Wilson',
            rating: 3,
            comment: 'Food was okay, but packaging could be better',
            date: '2024-03-12',
            orderId: 'ORD-12342'
        }
    ]);

    const [filter, setFilter] = useState('all');

    const filteredRatings = ratings.filter(rating => {
        if (filter === 'all') return true;
        return rating.rating === parseInt(filter);
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customer Ratings</Text>
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
                {filteredRatings.map((rating) => (
                    <View key={rating.id} style={styles.ratingCard}>
                        <View style={styles.ratingHeader}>
                            <View>
                                <Text style={styles.customerName}>{rating.customerName}</Text>
                                <Text style={styles.orderId}>Order #{rating.orderId}</Text>
                            </View>
                            <View style={styles.ratingStars}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < rating.rating ? 'star' : 'star-outline'}
                                        size={20}
                                        color="#FFD700"
                                    />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.ratingComment}>{rating.comment}</Text>
                        <Text style={styles.ratingDate}>{rating.date}</Text>
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
    ratingCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    ratingHeader: {
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
    ratingComment: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    ratingDate: {
        fontSize: 12,
        color: '#666',
    },
}); 