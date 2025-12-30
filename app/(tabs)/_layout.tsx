import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import colors from "@/utils/colors";
import { DEFAULT_HEADER_OPTIONS } from "@/utils/navigation";

export const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        ...DEFAULT_HEADER_OPTIONS,
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
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/add-book")}
              accessibilityRole="button"
              accessibilityLabel="Add a new book"
              style={{ marginRight: 12 }}
              hitSlop={10}
            >
              <Text
                style={{
                  color: colors.brand.DEFAULT,
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 16,
                }}
              >
                New book
              </Text>
            </Pressable>
          ),
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
