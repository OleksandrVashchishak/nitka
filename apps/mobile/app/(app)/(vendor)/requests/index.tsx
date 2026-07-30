import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { href } from "@/lib/href";
import { getVendorRequests } from "@/lib/requests-api";
import type { RequestStatus, VendorRequest } from "@/lib/types";
import { ChipRow } from "@/ui/sheet";
import {
  Badge,
  Empty,
  ErrorBox,
  Loading,
  Row,
  Screen,
  Title,
} from "@/ui";

const FILTERS = [
  { id: "ALL", label: "Усі" },
  { id: "NEW", label: "Нові" },
  { id: "CONTACTED", label: "В роботі" },
  { id: "DONE", label: "Готово" },
  { id: "CLOSED", label: "Закриті" },
];

export default function VendorRequestsScreen() {
  const query = useQuery({
    queryKey: ["vendor-requests"],
    queryFn: getVendorRequests,
  });
  const [filter, setFilter] = useState("ALL");

  const items = useMemo(() => {
    const all = query.data ?? [];
    const filtered =
      filter === "ALL" ? all : all.filter((r) => r.status === filter);
    return [...filtered].sort((a, b) => {
      if (a.status === "NEW" && b.status !== "NEW") return -1;
      if (b.status === "NEW" && a.status !== "NEW") return 1;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [query.data, filter]);

  if (query.isLoading) return <Loading />;
  if (query.error) {
    return (
      <Screen>
        <ErrorBox message={(query.error as Error).message} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.head}>
        <Title>Заявки</Title>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Empty title="Немає заявок" hint="Коли пара напише — зʼявиться тут" />
        }
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        renderItem={({ item }) => (
          <RequestRow
            item={item}
            onPress={() =>
              router.push(href(`/(app)/(vendor)/requests/${item.id}`))
            }
          />
        )}
      />
    </Screen>
  );
}

function RequestRow({
  item,
  onPress,
}: {
  item: VendorRequest;
  onPress: () => void;
}) {
  return (
    <Row
      title={item.user.name}
      subtitle={`${item.city} · ${new Date(item.eventDate).toLocaleDateString("uk-UA")} · ${item.guests} гостей`}
      right={
        <Badge label={statusUk(item.status)} tone={statusTone(item.status)} />
      }
      onPress={onPress}
    />
  );
}

function statusUk(s: RequestStatus) {
  if (s === "NEW") return "Нова";
  if (s === "CONTACTED") return "В роботі";
  if (s === "DONE") return "Готово";
  if (s === "CLOSED") return "Закрита";
  return s;
}

function statusTone(s: RequestStatus): "sage" | "warn" | "ok" | "muted" {
  if (s === "NEW") return "warn";
  if (s === "CONTACTED") return "sage";
  if (s === "DONE") return "ok";
  return "muted";
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8 },
  head: { paddingHorizontal: 16, paddingBottom: 4, gap: 8 },
  list: { paddingBottom: 24, paddingHorizontal: 0 },
});
