import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function RsvpLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen name="[token]" options={{ title: "Запрошення" }} />
    </Stack>
  );
}
