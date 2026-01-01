import React from "react";
import { View, Text, FlatList, Image, Button } from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "../store/useCartStore";

export default function CartScreen() {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItems = Object.values(cart);

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
            <View className="flex-row items-center bg-gray-100 p-4 mb-4 rounded-lg">
              <Image
                source={{ uri: item.image }}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
              />

              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>${item.price * item.quantity}</Text>

                <View className="flex-row mt-2 space-x-2">
                  <Button title="−" onPress={() => removeFromCart(item.id)} />
                  <Button
                    title="+"
                    onPress={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <>
          <Text className="text-xl font-bold text-right mb-4">
            Total: ${totalPrice}
          </Text>

          <Button
            title="Go to Checkout"
            onPress={() => router.push("/checkout")}
          />
        </>
      )}

      <View className="mt-3">
        <Button title="Back to Home" onPress={() => router.push("/home")} />
      </View>

      {cartItems.length > 0 && (
        <View className="mt-2">
          <Button title="Clear Cart" onPress={clearCart} color="red" />
        </View>
      )}
    </View>
  );
}
