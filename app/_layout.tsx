import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

void SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: avoids unhandled promise warnings during fast refresh
});

export default function RootLayout() {
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
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Montserrat_600SemiBold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Your Library" }} />
      <Stack.Screen name="add-book" options={{ title: "Add Book" }} />
      <Stack.Screen name="edit-book" options={{ title: "Edit Book" }} />
    </Stack>
  );
}
