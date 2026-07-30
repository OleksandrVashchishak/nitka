import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { colors } from "@/theme";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.paper,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  if (user.role === "VENDOR") return <Redirect href={href("/(app)/(vendor)")} />;
  if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
  return <Redirect href={href("/(app)/(couple)")} />;
}
