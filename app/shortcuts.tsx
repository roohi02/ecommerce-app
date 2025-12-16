import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ShortcutsScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Shortcuts</Text>
 
      <View className="flex-row flex-wrap justify-between">
        {[
          { title: "Orders", icon: "receipt-outline" },
          { title: "Wishlist", icon: "heart-outline" },
          { title: "Offers", icon: "pricetag-outline" },
          { title: "Support", icon: "help-circle-outline" },
        ].map((item) => (
          <Pressable
            key={item.title}
            className="w-[48%] bg-white rounded-xl p-4 mb-4 items-center shadow"
          >
            <Ionicons name={item.icon as any} size={28} color="#1e40af" />
            <Text className="mt-2 font-semibold">{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
