import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainPage = () => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [previousCartCount, setPreviousCartCount] = useState(0);
    const badgeScale = new Animated.Value(1);

    const posters = [
        require('../../assets/images/posters/jollibee.jpg'),
        require('../../assets/images/posters/chowking.png'),
        require('../../assets/images/posters/greenwich.png'),
        require('../../assets/images/posters/manginasal.jpg'),
        require('../../assets/images/posters/mcdonalds.png'),
    ];

    // Load cart count on mount and when it changes
    useEffect(() => {
        loadCartCount();
        const interval = setInterval(loadCartCount, 1000);
        return () => clearInterval(interval);
    }, []);

    // Animate badge when cart count changes
    useEffect(() => {
        if (cartItemCount > previousCartCount) {
            animateCartBadge();
        }
        setPreviousCartCount(cartItemCount);
    }, [cartItemCount]);

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

    const animateCartBadge = () => {
        Animated.sequence([
            Animated.timing(badgeScale, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(badgeScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / 300); // Assuming each image is 300 width
        setCurrentIndex(index);
    };

    const handleShopPress = (shopId: string) => {
        router.push({
            pathname: "/shop/[id]",
            params: { id: shopId }
        });
    };

  return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TouchableOpacity 
                        style={styles.searchBar}
                        onPress={() => router.push('/search')}
                    >
                        <Ionicons name="search" size={20} color="#666" />
                        <Text style={styles.searchText}>Search for restaurants or food...</Text>
                    </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/favorites')}
                    >
                        <Ionicons name="heart-outline" size={20} color="#333" />
                        <Text style={styles.buttonText}>Favorites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/orders')}
                    >
                        <Ionicons name="time-outline" size={20} color="#333" />
                        <Text style={styles.buttonText}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/orders')}
                    >
                        <Ionicons name="receipt-outline" size={20} color="#333" />
                        <Text style={styles.buttonText}>Orders</Text>
                    </TouchableOpacity>
                </View>

                {/* Posters with Dots Indicator */}
                <View>
                    <ScrollView 
                        horizontal={true} 
                        style={styles.posterContainer} 
                        onScroll={handleScroll}
                        scrollEventThrottle={16} // Throttle the scroll event
                    >
                        {posters.map((poster, index) => (
                            <Image key={index} source={poster} style={styles.poster} />
                        ))}
                    </ScrollView>
                    <View style={styles.dotsContainer}>
                        {posters.map((_, index) => (
                            <View 
                                key={index} 
                                style={[
                                    styles.dot, 
                                    { backgroundColor: currentIndex === index ? 'black' : 'lightgray' }
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Shops */}
                <View style={styles.sectionTitleContainer}>
                    <View style={styles.titleWithArrow}>
                        <Text style={styles.sectionTitle}>Shops</Text>
                        <View style={styles.arrowCircle}>
                            <Ionicons name="chevron-forward" size={20} color="#333" />
                        </View>
                    </View>
                </View>
                <View style={styles.shopsContainer}>
                    <TouchableOpacity style={styles.shopItem} onPress={() => handleShopPress('jollibee')}>
                        <View style={styles.shopLogoContainer}>
                            <Image source={require('../../assets/images/shops/jollibee logo1.png')} style={styles.shopLogo} />
                        </View>
                        <Text style={styles.shopName}>Jollibee</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shopItem} onPress={() => handleShopPress('mcdonalds')}>
                        <View style={styles.shopLogoContainer}>
                            <Image source={require('../../assets/images/shops/mcdo logo.png')} style={styles.shopLogo} />
                        </View>
                        <Text style={styles.shopName}>McDonald's</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shopItem} onPress={() => handleShopPress('greenwich')}>
                        <View style={styles.shopLogoContainer}>
                            <Image source={require('../../assets/images/shops/greenwichlogo.png')} style={styles.shopLogo} />
                        </View>
                        <Text style={styles.shopName}>Greenwich</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shopItem} onPress={() => handleShopPress('manginasal')}>
                        <View style={styles.shopLogoContainer}>
                            <Image source={require('../../assets/images/shops/manginasallogo.jpg')} style={styles.shopLogo} />
                        </View>
                        <Text style={styles.shopName}>Mang Inasal</Text>
                    </TouchableOpacity>
                </View>

                {/* Top Picks */}
                <View style={styles.sectionTitleContainer}>
                    <View style={styles.titleWithArrow}>
                        <Text style={styles.sectionTitle}>Top Picks</Text>
                        <View style={styles.arrowCircle}>
                            <Ionicons name="chevron-forward" size={20} color="#333" />
                        </View>
                    </View>
                </View>
                <ScrollView horizontal={true} style={styles.topPicksContainer}>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/1.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>Chowking</Text>
                        <Text style={styles.productName}>Pork Chow Fan</Text>
                        <Text style={styles.price}>₱69.00</Text>
                    </View>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/5.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>Jollibee</Text>
                        <Text style={styles.productName}>Burger Steak</Text>
                        <Text style={styles.price}>₱79.00</Text>
                    </View>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/6.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>Jollibee</Text>
                        <Text style={styles.productName}>JollySpagghetti YumBurger</Text>
                        <Text style={styles.price}>₱149.00</Text>
                    </View>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/9.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>McDonald's</Text>
                        <Text style={styles.productName}>Chicken Fillet</Text>
                        <Text style={styles.price}>₱79.00</Text>
                    </View>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/10.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>Mcdonald's</Text>
                        <Text style={styles.productName}>McSpagghetti McBurger</Text>
                        <Text style={styles.price}>₱139.00</Text>
                    </View>
                    <View style={styles.topPickItem}>
                        <Image source={require('../../assets/images/top picks/11.png')} style={styles.topPickImage} />
                        <Text style={styles.shopName1}>Jollibee</Text>
                        <Text style={styles.productName}>Chicken Fillet Ala King</Text>
                        <Text style={styles.price}>₱99.00</Text>
                    </View>
                    {/* Add more items as needed */}
                </ScrollView>

                {/* Keep Discovering */}
                <Text style={styles.sectionTitle}>Keep Discovering</Text>
                <View style={styles.keepDiscoveringContainer}>
                    <View style={styles.keepDiscoveringRow}>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster1.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>BE VIGILANT</Text>
                            <Text style={styles.keepDiscoveringDesc}>Don't share personal info</Text>
                        </View>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster2.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>HASSLE FREE</Text>
                            <Text style={styles.keepDiscoveringDesc}>Can order in multiple fast food at the same time</Text>
                        </View>
                    </View>
                    <View style={styles.keepDiscoveringRow}>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster3.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>DISCOUNT MEALS</Text>
                            <Text style={styles.keepDiscoveringDesc}>Offer discounts in breakfast, lunch, dinner</Text>
                        </View>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster4.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>BIG DEALS</Text>
                            <Text style={styles.keepDiscoveringDesc}>Save big deals with Super Daily Deals</Text>
                        </View>
                    </View>
                    <View style={styles.keepDiscoveringRow}>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster5.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>FIND YOUR LOCATION</Text>
                            <Text style={styles.keepDiscoveringDesc}>Help us find your location</Text>
                        </View>
                        <View style={styles.keepDiscoveringItem}>
                            <Image source={require('../../assets/images/keep discovering/poster6.png')} style={styles.keepDiscoveringImage} />
                            <Text style={styles.keepDiscoveringTitle}>PAYMENT METHOD</Text>
                            <Text style={styles.keepDiscoveringDesc}>We offer 2 different payment methods</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Text */}
                <Text style={styles.footerText}>That's all the contents for now</Text>
                
                {/* Add padding at the bottom to account for navigation bar */}
                <View style={{ height: 70 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#fff" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => router.push('/cart')}
                >
                    <View>
                        <Ionicons name="cart-outline" size={24} color="#fff" />
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
                    <Text style={styles.navText}>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                    <Text style={styles.navText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.navItem}
                    onPress={() => router.push('/profile')}
                >
                    <Ionicons name="person-outline" size={24} color="#fff" />
                    <Text style={styles.navText}>Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchBar: {
        height: 50,
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        gap: 10,
    },
    searchText: {
        color: '#999',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    buttonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    posterContainer: {
        height: 200,
        marginBottom: 10,
    },
    poster: {
        width: 390,
        height: '100%',
        marginRight: 10,
    },
    sectionTitleContainer: {
        marginVertical: 10,
    },
    titleWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shopsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    shopItem: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    shopLogoContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    shopLogo: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    shopName: {
        fontWeight: 'bold',
    },
    topPicksContainer: {
    flexDirection: 'row',
        marginBottom: 10,
    },
    topPickItem: {
    alignItems: 'center',
        marginRight: 15,
        width: 180,
    },
    topPickImage: {
        width: 160,
        height: 120,
        marginBottom: 5,
    },
    shopName1: {
        fontWeight: 'regular',
        fontSize: 13,
        color: '#333',
    },
    productName: {
        fontWeight: 'bold',
    },
    price: {
        color: '#333',
        fontWeight: 'bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    keepDiscoveringContainer: {
        padding: 10,
    },
    keepDiscoveringRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    keepDiscoveringItem: {
        flex: 1,
        marginHorizontal: 5,
    },
    keepDiscoveringImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    marginBottom: 8,
  },
    keepDiscoveringTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    keepDiscoveringDesc: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        marginVertical: 20,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#CA0606',
        height: 60,
        position: 'absolute',
    bottom: 0,
    left: 0,
        right: 0,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
    cartBadge: {
    position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#fff',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#CA0606',
        fontSize: 12,
        fontWeight: 'bold',
    },
    arrowCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
  },
});

export default MainPage;
