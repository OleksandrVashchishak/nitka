import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { href } from "@/lib/href";
import { getMyRequests } from "@/lib/requests-api";
import type { CoupleRequest, RequestStatus } from "@/lib/types";
import { colors } from "@/theme";
import { ChipRow } from "@/ui/sheet";
import {
  Badge,
  Card,
  Empty,
  ErrorBox,
  Loading,
  Row,
  Subtitle,
  Title,
} from "@/ui";

const STATUS_FILTERS = [
  { id: "ALL", label: "Усі" },
  { id: "NEW", label: "Нові" },
  { id: "CONTACTED", label: "На звʼязку" },
  { id: "DONE", label: "Готово" },
  { id: "CLOSED", label: "Закрито" },
];

function statusLabel(s: RequestStatus) {
  if (s === "NEW") return "Новий";
  if (s === "CONTACTED") return "На звʼязку";
  if (s === "DONE") return "Готово";
  return "Закрито";
}

function statusTone(s: RequestStatus): "ok" | "warn" | "muted" | "sage" {
  if (s === "DONE") return "ok";
  if (s === "CONTACTED") return "sage";
  if (s === "NEW") return "warn";
  return "muted";
}

export default function RequestsListScreen() {
  const q = useQuery({ queryKey: ["requests"], queryFn: getMyRequests });
  const [filter, setFilter] = useState("ALL");

  const all = q.data ?? [];

  const items = useMemo(() => {
    const filtered =
      filter === "ALL" ? all : all.filter((r) => r.status === filter);
    return [...filtered].sort((a, b) => {
      if (a.status === "NEW" && b.status !== "NEW") return -1;
      if (b.status === "NEW" && a.status !== "NEW") return 1;
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
  }, [all, filter]);

  const waiting = all.filter((r) => r.status === "NEW").length;
  const replied = all.filter((r) =>
    r.messages.some((m) => m.authorRole === "VENDOR"),
  ).length;

  if (q.isLoading) return <Loading />;
  if (q.isError) {
    return (
      <View style={styles.safe}>
        <ErrorBox
          message={q.error instanceof Error ? q.error.message : "Помилка"}
        />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.pad}>
        <Title>Мої запити</Title>
        <Subtitle>Переписка з підрядниками</Subtitle>

        {all.length > 0 ? (
          <View style={styles.kpi}>
            <KpiCard label="Усього" value={all.length} />
            <KpiCard label="Очікують" value={waiting} />
            <KpiCard label="Є відповідь" value={replied} />
          </View>
        ) : null}

        <ChipRow options={STATUS_FILTERS} value={filter} onChange={setFilter} />

        {items.length === 0 ? (
          <Empty
            title="Поки порожньо"
            hint="Надішли запит з каталогу підрядників"
          />
        ) : (
          items.map((r) => (
            <Row
              key={r.id}
              title={r.vendor.name}
              subtitle={`${r.city} · ${r.eventDate.slice(0, 10)} · ${r.guests} гостей`}
              right={
                <Badge
                  label={statusLabel(r.status)}
                  tone={statusTone(r.status)}
                />
              }
              onPress={() =>
                router.push(href(`/(app)/(couple)/requests/${r.id}`))
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: 16, paddingBottom: 32 },
  kpi: { flexDirection: "row", gap: 8, marginBottom: 12 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.mist,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  kpiLabel: { fontSize: 11, color: colors.inkSoft },
  kpiValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: colors.primaryDeep,
  },
});
