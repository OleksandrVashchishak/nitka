import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function ContentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Журнал" }} />
      <Stack.Screen name="[slug]" options={{ title: "Стаття" }} />
    </Stack>
  );
}
