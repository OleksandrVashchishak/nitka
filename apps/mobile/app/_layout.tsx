import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/lib/auth-store";
import { useAppFonts } from "@/lib/use-app-fonts";
import {
  attachPushResponseListener,
  registerForPushAsync,
} from "@/lib/push";
import { colors } from "@/theme";
import { ToastHost } from "@/ui/toast";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const { loaded: fontsLoaded } = useAppFonts();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    if (!hydrated) return;
    void restoreSession();
  }, [hydrated, restoreSession]);

  useEffect(() => {
    if (!user || !accessToken) return;
    void registerForPushAsync().catch(() => undefined);
  }, [user?.id, accessToken]);

  useEffect(() => {
    return attachPushResponseListener();
  }, []);

  if (!hydrated || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.mist,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.mist },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="rsvp" />
          <Stack.Screen name="vendors" />
          <Stack.Screen name="content" />
          <Stack.Screen name="partner-invite" />
          <Stack.Screen name="(app)" />
        </Stack>
        <ToastHost />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
