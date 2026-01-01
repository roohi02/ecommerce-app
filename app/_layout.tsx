import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider } from "@stripe/stripe-react-native";
import "../global.css";

export default function Layout() {
  return (
    <StripeProvider
      publishableKey="pk_test_51SfNx3KE1mis6wdMbz8ES7QrVNIGPQv6L4halLEyZgxSV5anfrP0KhaLWuCTEFw1jJU8o9I7s5WXc4tx21Guo1M900bEZm8xCI" // your test key
      merchantIdentifier="merchant.com.yourapp" // iOS only
    >
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="shortcuts"
          options={{
            title: "Shortcuts",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </StripeProvider>
  );
}
