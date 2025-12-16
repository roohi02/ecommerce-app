import { View, Text } from "react-native";
import HomeScreen from "../src/screens/HomeScreen";
import { verifyInstallation } from "nativewind";
export default function Home() {
    verifyInstallation();
  return (
    <HomeScreen />
  );
}
