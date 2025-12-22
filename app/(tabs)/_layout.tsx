import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import colors from "@/utils/colors";

export const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Montserrat_600SemiBold",
        },
        headerStyle: {
          backgroundColor: colors.brand.subtle,
        },
        tabBarActiveTintColor: colors.brand.pressed,
        tabBarInactiveTintColor: colors.text.muted,

        tabBarActiveBackgroundColor: colors.brand.subtle,
        tabBarLabelStyle: {
          fontFamily: "Montserrat_500Medium",
        },
        tabBarStyle: {
          backgroundColor: colors.surface.DEFAULT,
          borderTopColor: colors.border.DEFAULT,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Your Library",
          tabBarLabel: "Library",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          tabBarLabel: "Timeline",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
