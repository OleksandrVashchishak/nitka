import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { getNotificationsSummary } from "@/lib/misc-api";
import { colors } from "@/theme";

export default function VendorLayout() {
  const user = useAuthStore((s) => s.user);
  const notifQ = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsSummary,
    enabled: !!user && user.role === "VENDOR",
    refetchInterval: 60_000,
  });

  const badge = notifQ.data?.newRequests || notifQ.data?.total || 0;

  if (!user) return <Redirect href="/login" />;
  if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
  if (user.role === "COUPLE") return <Redirect href={href("/(app)/(couple)")} />;
  if (user.role !== "VENDOR") return <Redirect href={href("/(app)")} />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper },
        headerTintColor: colors.ink,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Кабінет",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Заявки",
          headerShown: false,
          tabBarBadge: badge ? badge : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профіль",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
