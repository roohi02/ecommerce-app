import React from "react";
import { View, FlatList, Text } from "react-native";
import { useFetch } from "@/hooks/useFetch";
import { ActivityIndicator } from "react-native";

type User = {
  id: number;
  name: string;
  mailid: string;
};
const UserList = () => {
  const {
    data: users,
    loading,
    error,
  } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users");
  if (loading)
    return (
      <View className="flex-1 item-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" className="mt-4" />
      </View>
    );
  if (error)
    return (
      <View className="item-center justify-center">
        <Text className="text-blue-500 text-lg,font-bold"> Error:{error}</Text>
      </View>
    );
  if (!users || users.length === 0) {
    return (
      <View className="item-center justify-center">
        <Text className="text-blue-500 text-lg,font-bold"> No users found</Text>
      </View>
    );
  }
  return (
    <FlatList<User>
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="p-4 bg-white rounded-lg mb-2 shadow">
          <Text className="text-lg font-semibold text-gray-800">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500">{item.mailid}</Text>
        </View>
      )}
    />
  );
};
