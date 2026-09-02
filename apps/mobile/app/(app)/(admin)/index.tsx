import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAdminStats } from "@/lib/admin-api";
import { colors } from "@/theme";
import { ErrorBox, Loading, Screen, Subtitle, Title } from "@/ui";

export default function AdminStatsScreen() {
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });

  if (statsQuery.isLoading) return <Loading />;
  if (statsQuery.error || !statsQuery.data) {
    return (
      <Screen>
        <ErrorBox
          message={(statsQuery.error as Error)?.message || "Немає даних"}
        />
      </Screen>
    );
  }

  const s = statsQuery.data;

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Адмінка</Title>
                <Subtitle>Загальна статистика fata.studio</Subtitle>
        <View style={styles.grid}>
          <Stat label="Користувачі" value={s.users} />
          <Stat label="Пари" value={s.couples} />
          <Stat label="Підрядники" value={s.vendors} />
          <Stat label="На модерації" value={s.pendingVendors} />
          <Stat label="Заявки" value={s.requests} />
          <Stat label="Відгуки" value={s.reviews} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  stat: {
    width: "47%",
    backgroundColor: colors.mist,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statValue: { fontSize: 24, fontWeight: "700", color: colors.primaryDeep },
  statLabel: { marginTop: 4, fontSize: 13, color: colors.inkSoft },
});
