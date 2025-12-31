// src/screens/CartScreen.tsx
import React from "react";
import { View, Text, Button, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../store/useCartStore";

const products = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
  image: `https://picsum.photos/100?random=${i + 1}`, // small thumbnail
}));

export default function CartScreen() {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Get cart items with product details
  const cartItems = Object.entries(cart)
    .filter(([_, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const product = products.find((p) => p.id === Number(id));
      return {
        id: Number(id),
        name: product?.name ?? "Unknown Product",
        price: product?.price ?? 0,
        quantity,
        image: product?.image ?? "",
      };
    });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold text-center mb-6 text-blue-900">
        Cart
      </Text>

      {cartItems.length === 0 ? (
        <Text className="text-center text-lg text-gray-500">
          Your cart is empty
        </Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md flex-row items-center">
              <Image
                source={{ uri: item.image }}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
              />

              <View className="flex-1">
                <Text className="text-xl font-semibold">{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Price: ${item.price * item.quantity}</Text>

                <View className="flex-row mt-2 space-x-2">
                  <Button title="−" onPress={() => removeFromCart(item.id)} />
                  <Button title="+" onPress={() => addToCart(item.id)} />
                </View>
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <Text className="text-xl font-bold text-right mb-4">
          Total: ${totalPrice}
        </Text>
      )}

      <Button title="Back to Home" onPress={() => router.push("/home")} />
      {cartItems.length > 0 && (
        <Button title="Clear Cart" onPress={clearCart} color="red" />
      )}
    </View>
  );
}
