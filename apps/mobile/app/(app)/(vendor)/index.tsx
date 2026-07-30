import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { getVendorDashboard, getVendorRequests } from "@/lib/requests-api";
import { colors } from "@/theme";
import {
  Badge,
  Button,
  Empty,
  ErrorBox,
  Loading,
  Row,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function VendorDashboardScreen() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const dashQuery = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: getVendorDashboard,
  });

  const requestsQuery = useQuery({
    queryKey: ["vendor-requests"],
    queryFn: getVendorRequests,
  });

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  if (dashQuery.isLoading) return <Loading />;

  if (dashQuery.error) {
    return (
      <Screen>
        <ErrorBox message={(dashQuery.error as Error).message} />
        <Button label="Вийти" variant="ghost" onPress={() => void onLogout()} />
      </Screen>
    );
  }

  const data = dashQuery.data;
  const stats = data?.stats;

  if (!data?.vendor) {
    return (
      <Screen style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Title>Привіт, {user?.name}</Title>
          <Empty
            title="Профілю ще немає"
            hint="Заповни дані — і зʼявишся в каталозі після модерації"
          />
          <Button
            label="Створити профіль"
            onPress={() => router.push(href("/(app)/(vendor)/profile"))}
          />
          <Button label="Вийти" variant="ghost" onPress={() => void onLogout()} />
        </ScrollView>
      </Screen>
    );
  }

  const series = stats?.viewsSeries ?? [];
  const maxViews = Math.max(1, ...series.map((d) => d.count));
  const recent = [...(requestsQuery.data ?? [])]
    .sort((a, b) => {
      if (a.status === "NEW" && b.status !== "NEW") return -1;
      if (b.status === "NEW" && a.status !== "NEW") return 1;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    })
    .slice(0, 5);

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Привіт, {user?.name}</Title>
        <Subtitle>
          {data.vendor.name}
          {data.vendor.status ? ` · ${statusUk(data.vendor.status)}` : ""}
        </Subtitle>

        {data.vendor.status ? (
          <Badge
            label={statusUk(data.vendor.status)}
            tone={
              data.vendor.status === "APPROVED"
                ? "ok"
                : data.vendor.status === "PENDING"
                  ? "warn"
                  : "muted"
            }
          />
        ) : null}

        <View style={styles.grid}>
          <StatCard label="Перегляди" value={stats?.views ?? 0} />
          <StatCard label="За 7 днів" value={stats?.views7d ?? 0} />
          <StatCard label="Заявки" value={stats?.requests ?? 0} />
          <StatCard label="Нові" value={stats?.newRequests ?? 0} />
          <StatCard label="В обраному" value={stats?.favorites ?? 0} />
          <StatCard label="За 30 днів" value={stats?.views30d ?? 0} />
        </View>

        {series.length > 0 ? (
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Перегляди за 7 днів</Text>
            <View style={styles.bars}>
              {series.map((day) => (
                <View key={day.date} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(
                          4,
                          Math.round((day.count / maxViews) * 56),
                        ),
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.date.slice(8)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.section}>Останні заявки</Text>
        {recent.length === 0 ? (
          <Empty title="Поки немає заявок" />
        ) : (
          recent.map((r) => (
            <Row
              key={r.id}
              title={r.user.name}
              subtitle={`${r.city} · ${new Date(r.eventDate).toLocaleDateString("uk-UA")}`}
              right={
                <Badge
                  label={statusUk(r.status)}
                  tone={
                    r.status === "NEW"
                      ? "warn"
                      : r.status === "DONE"
                        ? "ok"
                        : "sage"
                  }
                />
              }
              onPress={() =>
                router.push(href(`/(app)/(vendor)/requests/${r.id}`))
              }
            />
          ))
        )}

        <Row
          title="Усі заявки"
          subtitle={
            stats?.newRequests
              ? `${stats.newRequests} нових`
              : "Вхідні звернення"
          }
          onPress={() => router.push(href("/(app)/(vendor)/requests"))}
        />
        <Row
          title="Профіль"
          subtitle="Назва, фото, ціна"
          onPress={() => router.push(href("/(app)/(vendor)/profile"))}
        />

        <Button label="Вийти" variant="ghost" onPress={() => void onLogout()} />
      </ScrollView>
    </Screen>
  );
}

function statusUk(s: string) {
  if (s === "APPROVED") return "Схвалено";
  if (s === "PENDING") return "На перевірці";
  if (s === "REJECTED") return "Відхилено";
  if (s === "NEW") return "Нова";
  if (s === "CONTACTED") return "В роботі";
  if (s === "DONE") return "Готово";
  if (s === "CLOSED") return "Закрита";
  return s;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 40, gap: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  stat: {
    width: "31%",
    flexGrow: 1,
    backgroundColor: colors.mist,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primaryDeep,
  },
  statLabel: { marginTop: 4, fontSize: 12, color: colors.inkSoft },
  chart: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 10,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 72,
    gap: 4,
  },
  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: {
    width: "70%",
    borderRadius: 4,
    backgroundColor: colors.primary,
    minHeight: 4,
  },
  barLabel: { marginTop: 4, fontSize: 10, color: colors.inkSoft },
  section: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
});
