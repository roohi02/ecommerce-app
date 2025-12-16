import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

const cartItems = [
  { id: 1, name: "iPhone 15", quantity: 1, price: "$999" },
];

export default function CartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold text-center mb-6 text-blue-900">
        Cart
      </Text>

      {cartItems.map((item) => (
        <View
          key={item.id}
          className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
        >
          <Text className="text-xl font-semibold">{item.name}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Price: {item.price}</Text>
        </View>
      ))}

      <Button title="Back to Home" onPress={() => router.push("/home")} />
    </View>
  );
}
