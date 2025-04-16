// app/(tabs)/_layout.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "grievance") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "lostfound") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "library") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "examhub") {
            iconName = focused ? "school" : "school-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#6366f1",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    />
  );
}
