// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useCartStore } from "../store/useCartStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 16;

// 20 products → 2 per row × 10 rows
const products = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
  image: `https://picsum.photos/300?random=${i + 1}`,
}));

export default function HomeScreen() {
  const router = useRouter();
  

  const cart = useCartStore((state) => state.cart);
const addToCart = useCartStore((state) => state.addToCart);
const removeFromCart = useCartStore((state) => state.removeFromCart);
const totalItems = useCartStore((state) =>
  Object.values(state.cart).reduce((a, b) => a + b, 0)
);
 

  const renderItem = ({ item }: { item: (typeof products)[0] }) => {
    const quantity = cart[item.id] || 0;

    return (
      <View
        style={{ width: ITEM_WIDTH }}
        className="bg-white rounded-xl m-2 p-2 shadow"
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: 140 }}
          className="rounded-lg"
        />

        <Text className="mt-2 font-semibold text-base">{item.name}</Text>
        <Text className="text-gray-500 mb-2">${item.price}</Text>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
            className="bg-red-500 px-3 py-1 rounded"
          >
            <Text className="text-white text-lg">−</Text>
          </TouchableOpacity>

          <Text className="text-lg font-bold">{quantity}</Text>

          <TouchableOpacity
            onPress={() => addToCart(item.id)}
            className="bg-green-500 px-3 py-1 rounded"
          >
            <Text className="text-white text-lg">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Text className="text-5xl font-bold text-center mt-4 mb-2">
        Grocery Selection
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {totalItems > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="absolute bottom-6 left-6 right-6 bg-blue-600 p-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-bold">
            Go to Cart ({totalItems})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
