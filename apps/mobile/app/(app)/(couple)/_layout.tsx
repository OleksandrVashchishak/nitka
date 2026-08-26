import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { getNotificationsSummary } from "@/lib/misc-api";
import { colors, fonts } from "@/theme";

export default function CoupleLayout() {
  const user = useAuthStore((s) => s.user);
  const notifQ = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsSummary,
    enabled: !!user && user.role === "COUPLE",
    refetchInterval: 60_000,
  });

  const guestBadge =
    (notifQ.data?.items ?? []).find(
      (i) =>
        i.key.includes("rsvp") || i.label.toLowerCase().includes("rsvp"),
    )?.count ??
    notifQ.data?.pendingRsvp ??
    notifQ.data?.newRsvp ??
    0;

  if (!user) return <Redirect href="/login" />;
  if (user.role === "VENDOR") return <Redirect href={href("/(app)/(vendor)")} />;
  if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
  if (user.role !== "COUPLE") return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.sansSemi,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarIconStyle: { marginTop: 2 },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          borderTopWidth: 0.5,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Дім",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarBadge: (() => {
            const n = (notifQ.data?.items ?? [])
              .filter(
                (i) =>
                  !i.key.toLowerCase().includes("vendor") &&
                  !i.key.toLowerCase().includes("request") &&
                  !i.label.toLowerCase().includes("вендор") &&
                  !i.label.toLowerCase().includes("запит"),
              )
              .reduce((sum, i) => sum + (i.count || 0), 0);
            return n > 0 ? n : undefined;
          })(),
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: "Чекліст",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "checkbox" : "checkbox-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guests"
        options={{
          title: "Гості",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarBadge: guestBadge ? guestBadge : undefined,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Бюджет",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Ще",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "ellipsis-horizontal-circle" : "ellipsis-horizontal"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen name="requests" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="wedding" options={{ href: null }} />
      <Tabs.Screen name="day-plan" options={{ href: null }} />
      <Tabs.Screen name="seating" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
      <Tabs.Screen name="website" options={{ href: null }} />
      <Tabs.Screen name="invitations" options={{ href: null }} />
    </Tabs>
  );
}
