import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Profile Header */}
      <View className="bg-white rounded-xl p-4 items-center mb-6 shadow">
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-xl font-bold">John Doe</Text>
        <Text className="text-gray-500">john.doe@email.com</Text>
      </View>

      {/* Options */}
      {[
        { label: "My Orders", icon: "bag-outline" },
        { label: "Addresses", icon: "location-outline" },
        { label: "Payment Methods", icon: "card-outline" },
        { label: "Logout", icon: "log-out-outline" },
      ].map((item) => (
        <Pressable
          key={item.label}
          className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow"
        >
          <Ionicons name={item.icon as any} size={22} color="#1e40af" />
          <Text className="ml-3 text-base font-medium">{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
