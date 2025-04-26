import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SalesData {
    date: string;
    totalSales: number;
    orderCount: number;
    averageOrderValue: number;
    topItems: Array<{
        name: string;
        quantity: number;
        revenue: number;
    }>;
}

export default function Reports() {
    const router = useRouter();
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [salesData, setSalesData] = useState<SalesData[]>([]);

    useEffect(() => {
        fetchSalesData();
    }, [timeframe]);

    const fetchSalesData = async () => {
        // In a real app, fetch from your backend based on timeframe
        const mockData: SalesData[] = [
            {
                date: '2024-04-18',
                totalSales: 15000,
                orderCount: 45,
                averageOrderValue: 333.33,
                topItems: [
                    { name: 'Chicken Joy', quantity: 30, revenue: 2970 },
                    { name: 'Jolly Spaghetti', quantity: 25, revenue: 1875 },
                    { name: 'Burger Steak', quantity: 20, revenue: 1780 }
                ]
            },
            {
                date: '2024-04-17',
                totalSales: 12500,
                orderCount: 38,
                averageOrderValue: 328.95,
                topItems: [
                    { name: 'Chicken Joy', quantity: 25, revenue: 2475 },
                    { name: 'Burger Steak', quantity: 22, revenue: 1958 },
                    { name: 'Jolly Spaghetti', quantity: 18, revenue: 1350 }
                ]
            }
        ];
        setSalesData(mockData);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sales Reports</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.timeframeSelector}>
                {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                    <TouchableOpacity
                        key={period}
                        style={[styles.timeframeButton, timeframe === period && styles.activeTimeframe]}
                        onPress={() => setTimeframe(period)}
                    >
                        <Text style={[
                            styles.timeframeText,
                            timeframe === period && styles.activeTimeframeText
                        ]}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {salesData.map((data, index) => (
                    <View key={index} style={styles.reportCard}>
                        <Text style={styles.dateText}>
                            {new Date(data.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>

                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>₱{data.totalSales.toLocaleString()}</Text>
                                <Text style={styles.statLabel}>Total Sales</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{data.orderCount}</Text>
                                <Text style={styles.statLabel}>Orders</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>₱{data.averageOrderValue.toFixed(2)}</Text>
                                <Text style={styles.statLabel}>Avg. Order</Text>
                            </View>
                        </View>

                        <View style={styles.topItemsSection}>
                            <Text style={styles.sectionTitle}>Top Items</Text>
                            {data.topItems.map((item, itemIndex) => (
                                <View key={itemIndex} style={styles.topItemRow}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <View style={styles.itemStats}>
                                        <Text style={styles.itemQuantity}>{item.quantity} sold</Text>
                                        <Text style={styles.itemRevenue}>₱{item.revenue}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
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
    timeframeSelector: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
    },
    timeframeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    activeTimeframe: {
        backgroundColor: '#CA0606',
    },
    timeframeText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTimeframeText: {
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    reportCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
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
    topItemsSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    topItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemName: {
        fontSize: 14,
        flex: 1,
    },
    itemStats: {
        flexDirection: 'row',
        gap: 15,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    itemRevenue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#CA0606',
    },
}); 