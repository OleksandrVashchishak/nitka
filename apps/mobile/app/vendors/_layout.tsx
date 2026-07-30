import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function VendorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.paper },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Каталог" }} />
      <Stack.Screen name="[slug]" options={{ title: "Підрядник" }} />
    </Stack>
  );
}
