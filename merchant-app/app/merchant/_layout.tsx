import { Stack } from 'expo-router';

export default function MerchantLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fff' },
            }}
        >
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="products" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="reports" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
        </Stack>
    );
} 