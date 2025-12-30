import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { DEFAULT_HEADER_OPTIONS } from "@/utils/navigation";

SplashScreen.preventAutoHideAsync();

export const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-surface" edges={[]}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            ...DEFAULT_HEADER_OPTIONS,
            headerBackButtonDisplayMode: "minimal",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-book" options={{ title: "Add Book" }} />
          <Stack.Screen
            name="books/[id]/index"
            options={{
              title: "Book Details",
              headerBackTitle: "Library",
            }}
          />
          <Stack.Screen
            name="books/[id]/insights/new"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="insights/new"
            options={{ title: "New Insight", presentation: "modal" }}
          />
          <Stack.Screen
            name="books/[id]/insights/[insightId]/edit"
            options={{ presentation: "modal" }}
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
