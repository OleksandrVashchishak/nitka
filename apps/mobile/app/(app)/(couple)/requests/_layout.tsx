import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function RequestsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Заявки" }} />
      <Stack.Screen name="[id]" options={{ title: "Чат" }} />
    </Stack>
  );
}
