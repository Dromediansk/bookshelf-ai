import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { View } from "react-native";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: avoids unhandled promise warnings during fast refresh
});

export const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontFamily: "Montserrat_600SemiBold",
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Your Library" }} />
          <Stack.Screen name="add-book" options={{ title: "Add Book" }} />
          <Stack.Screen
            name="books/[id]/index"
            options={{ title: "Book Details" }}
          />
          <Stack.Screen
            name="books/[id]/edit"
            options={{ title: "Edit Book" }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RootLayout;
