import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Animated, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import shop data
import { shopData } from './shop/[id]';

// Types for our filters and items
type FilterType = 'all' | 'restaurant' | 'food' | 'price';
type PriceRange = 'all' | 'under100' | 'under200' | 'under300' | 'above300';
type SortOption = 'relevance' | 'price-low-high' | 'price-high-low' | 'rating' | 'distance' | 'popularity';

interface MenuItem {
    name: string;
    price: string;
    image: any;
    description: string;
}

interface Shop {
    name: string;
    logo: any;
    rating: number;
    deliveryTime: string;
    description: string;
    specialOffers: string[];
    categories: string[];
    popularItems: MenuItem[];
    distance?: number; // in kilometers
    popularity?: number; // number of orders/views
}

interface SearchResult {
    id: string;
    type: 'restaurant' | 'food';
    name: string;
    image: any;
    description?: string;
    price?: string;
    restaurant?: string;
    distance?: number;
    popularity?: number;
}

export default function SearchPage() {
    const router = useRouter();
    const { query } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>(query?.toString() || '');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [priceRange, setPriceRange] = useState<PriceRange>('all');
    const [sortOption, setSortOption] = useState<SortOption>('relevance');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [suggestedSearches, setSuggestedSearches] = useState<string[]>([
        'Chicken Joy', 'Pizza', 'Burger', 'Rice Meals', 'Breakfast',
        'Spaghetti', 'Desserts', 'Beverages', 'Value Meals'
    ]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const badgeScale = new Animated.Value(1);

    // Animation values
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    // Load search history on mount
    useEffect(() => {
        loadSearchHistory();
        loadCartCount();
    }, []);

    // Animation effect when results change
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        return () => {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
        };
    }, [results]);

    // Load search history from AsyncStorage
    const loadSearchHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('searchHistory');
            if (history) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    };

    // Save search to history
    const saveToHistory = async (query: string) => {
        try {
            const updatedHistory = [
                query,
                ...searchHistory.filter(item => item !== query)
            ].slice(0, 10); // Keep only last 10 searches
            setSearchHistory(updatedHistory);
            await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    };

    // Clear search history
    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem('searchHistory');
            setSearchHistory([]);
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    };

    // Load cart count
    const loadCartCount = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartItemCount(totalItems);
            }
        } catch (error) {
            console.error('Error loading cart count:', error);
        }
    };

    // Handle search
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setShowSuggestions(text.length > 0);
        if (text) {
            const results = performSearch(text);
            setResults(results);
        } else {
            setResults([]);
        }
    };

    // Execute search
    const executeSearch = (query: string) => {
        setSearchQuery(query);
        setShowSuggestions(false);
        saveToHistory(query);
        const results = performSearch(query);
        setResults(results);
        Keyboard.dismiss();
    };

    // Enhanced performSearch function with sorting
    const performSearch = (searchText: string) => {
        const searchResults: SearchResult[] = [];
        const searchLower = searchText.toLowerCase();

        // Search through restaurants
        Object.entries(shopData).forEach(([id, shop]: [string, Shop]) => {
            if (shop.name.toLowerCase().includes(searchLower)) {
                searchResults.push({
                    id,
                    type: 'restaurant',
                    name: shop.name,
                    image: shop.logo,
                    description: shop.description,
                    distance: shop.distance,
                    popularity: shop.popularity
                });
            }

            // Search through menu items
            shop.popularItems.forEach((item: MenuItem) => {
                if (
                    item.name.toLowerCase().includes(searchLower) ||
                    item.description.toLowerCase().includes(searchLower)
                ) {
                    const itemId = `${id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
                    searchResults.push({
                        id: itemId,
                        type: 'food',
                        name: item.name,
                        image: item.image,
                        description: item.description,
                        price: item.price,
                        restaurant: shop.name,
                        distance: shop.distance,
                        popularity: shop.popularity
                    });
                }
            });
        });

        // Apply sorting
        return sortResults(filterResults(searchResults));
    };

    // Function to filter results based on active filters
    const filterResults = (results: SearchResult[]) => {
        let filtered = results;

        // Filter by type
        if (activeFilter !== 'all') {
            filtered = filtered.filter(item => {
                if (activeFilter === 'restaurant') return item.type === 'restaurant';
                if (activeFilter === 'food') return item.type === 'food';
                return true;
            });
        }

        // Filter by price range (only for food items)
        if (priceRange !== 'all') {
            filtered = filtered.filter(item => {
                if (!item.price) return false;
                const price = parseInt(item.price.replace('₱', ''));
                switch (priceRange) {
                    case 'under100': return price < 100;
                    case 'under200': return price < 200;
                    case 'under300': return price < 300;
                    case 'above300': return price >= 300;
                    default: return true;
                }
            });
        }

        return filtered;
    };

    // Sort results based on selected option
    const sortResults = (results: SearchResult[]) => {
        return [...results].sort((a, b) => {
            switch (sortOption) {
                case 'price-low-high':
                    return (parseFloat((a.price || '0').replace('₱', '')) || 0) - 
                           (parseFloat((b.price || '0').replace('₱', '')) || 0);
                case 'price-high-low':
                    return (parseFloat((b.price || '0').replace('₱', '')) || 0) - 
                           (parseFloat((a.price || '0').replace('₱', '')) || 0);
                case 'distance':
                    return (a.distance || 0) - (b.distance || 0);
                case 'popularity':
                    return (b.popularity || 0) - (a.popularity || 0);
                default:
                    return 0;
            }
        });
    };

    const handleSortChange = (option: SortOption) => {
        setSortOption(option);
        setResults(sortResults(results));
    };

    const handleItemPress = (result: SearchResult) => {
        if (result.type === 'restaurant') {
            router.push({
                pathname: "/shop/[id]",
                params: { id: result.id }
            });
        } else {
            router.push({
                pathname: "/product/[id]",
                params: { id: result.id }
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for restaurants or food..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons name="options" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.cartButton}
                    onPress={() => router.push('/cart')}
                >
                    <View>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                        {cartItemCount > 0 && (
                            <Animated.View 
                                style={[
                                    styles.cartBadge,
                                    { transform: [{ scale: badgeScale }] }
                                ]}
                            >
                                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                            </Animated.View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Enhanced Filters */}
            {showFilters && (
                <Animated.View 
                    style={[
                        styles.filtersContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.filterTitle}>Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {['all', 'restaurant', 'food'].map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter && styles.activeFilterChip
                                ]}
                                onPress={() => setActiveFilter(filter as FilterType)}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    activeFilter === filter && styles.activeFilterChipText
                                ]}>
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.filterTitle}>Price Range</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {[
                            { id: 'all', label: 'All Prices' },
                            { id: 'under100', label: 'Under ₱100' },
                            { id: 'under200', label: 'Under ₱200' },
                            { id: 'under300', label: 'Under ₱300' },
                            { id: 'above300', label: '₱300 & Above' }
                        ].map((range) => (
                            <TouchableOpacity
                                key={range.id}
                                style={[
                                    styles.filterChip,
                                    priceRange === range.id && styles.activeFilterChip
                                ]}
                                onPress={() => setPriceRange(range.id as PriceRange)}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    priceRange === range.id && styles.activeFilterChipText
                                ]}>
                                    {range.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={styles.filterTitle}>Sort By</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {[
                            { id: 'relevance', label: 'Relevance' },
                            { id: 'price-low-high', label: 'Price: Low to High' },
                            { id: 'price-high-low', label: 'Price: High to Low' },
                            { id: 'distance', label: 'Nearest' },
                            { id: 'popularity', label: 'Most Popular' }
                        ].map((sort) => (
                            <TouchableOpacity
                                key={sort.id}
                                style={[
                                    styles.filterChip,
                                    sortOption === sort.id && styles.activeFilterChip
                                ]}
                                onPress={() => handleSortChange(sort.id as SortOption)}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    sortOption === sort.id && styles.activeFilterChipText
                                ]}>
                                    {sort.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}

            {/* Search Suggestions and History */}
            {showSuggestions && !results.length ? (
                <ScrollView style={styles.suggestionsContainer}>
                    {searchQuery && suggestedSearches
                        .filter(suggestion => 
                            suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((suggestion, index) => (
                            <TouchableOpacity
                                key={`suggestion-${index}`}
                                style={styles.suggestionItem}
                                onPress={() => executeSearch(suggestion)}
                            >
                                <Ionicons name="search-outline" size={20} color="#666" />
                                <Text style={styles.suggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            ) : !searchQuery && !results.length ? (
                <ScrollView style={styles.suggestionsContainer}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Recent Searches</Text>
                        <TouchableOpacity onPress={clearHistory}>
                            <Text style={styles.clearHistory}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    {searchHistory.map((item, index) => (
                        <TouchableOpacity
                            key={`history-${index}`}
                            style={styles.suggestionItem}
                            onPress={() => executeSearch(item)}
                        >
                            <Ionicons name="time-outline" size={20} color="#666" />
                            <Text style={styles.suggestionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={styles.suggestedTitle}>Suggested Searches</Text>
                    {suggestedSearches.map((suggestion, index) => (
                        <TouchableOpacity
                            key={`suggested-${index}`}
                            style={styles.suggestionItem}
                            onPress={() => executeSearch(suggestion)}
                        >
                            <Ionicons name="trending-up-outline" size={20} color="#666" />
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : null}

            {/* Animated Search Results */}
            <Animated.ScrollView 
                style={[
                    styles.resultsContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.resultCard}
                            onPress={() => handleItemPress(result)}
                        >
                            <Image source={result.image} style={styles.resultImage} />
                            <View style={styles.resultInfo}>
                                <Text style={styles.resultName}>{result.name}</Text>
                                {result.type === 'food' && (
                                    <>
                                        <Text style={styles.resultRestaurant}>{result.restaurant}</Text>
                                        <Text style={styles.resultPrice}>{result.price}</Text>
                                    </>
                                )}
                                <Text style={styles.resultDescription} numberOfLines={2}>
                                    {result.description}
                                </Text>
                                {result.distance && (
                                    <Text style={styles.resultDistance}>{result.distance} km away</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                ) : searchQuery ? (
                    <View style={styles.noResults}>
                        <Ionicons name="search-outline" size={48} color="#ccc" />
                        <Text style={styles.noResultsText}>No results found</Text>
                        <Text style={styles.noResultsSubtext}>Try different keywords or filters</Text>
                    </View>
                ) : null}
            </Animated.ScrollView>
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
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    filterButton: {
        padding: 8,
    },
    filtersContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterScroll: {
        marginBottom: 15,
    },
    filterChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    activeFilterChip: {
        backgroundColor: '#CA0606',
    },
    filterChipText: {
        color: '#333',
    },
    activeFilterChipText: {
        color: '#fff',
    },
    resultsContainer: {
        flex: 1,
    },
    resultCard: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    resultInfo: {
        flex: 1,
        marginLeft: 15,
    },
    resultName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultRestaurant: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    resultPrice: {
        fontSize: 14,
        color: '#CA0606',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultDescription: {
        fontSize: 12,
        color: '#666',
    },
    resultDistance: {
        fontSize: 12,
        color: '#999',
    },
    noResults: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    suggestionsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 10,
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    clearHistory: {
        color: '#CA0606',
        fontSize: 14,
    },
    suggestedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    cartButton: {
        padding: 8,
    },
    cartBadge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#CA0606',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});