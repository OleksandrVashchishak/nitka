import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet } from "react-native";
import { getAdminRequests } from "@/lib/admin-api";
import type { RequestStatus } from "@/lib/types";
import {
  Badge,
  Empty,
  ErrorBox,
  Loading,
  Row,
  Screen,
} from "@/ui";

type AdminRequest = {
  id: string;
  status: RequestStatus;
  city: string;
  eventDate: string;
  guests: number;
  budget: number;
  user?: { name: string; email: string };
  vendor?: { name: string };
};

export default function AdminRequestsScreen() {
  const query = useQuery({
    queryKey: ["admin-requests"],
    queryFn: () => getAdminRequests() as Promise<AdminRequest[]>,
  });

  if (query.isLoading) return <Loading />;
  if (query.error) {
    return (
      <Screen>
        <ErrorBox message={(query.error as Error).message} />
      </Screen>
    );
  }

  const items = query.data ?? [];

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Empty title="Немає заявок" />}
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
        renderItem={({ item }) => (
          <Row
            title={item.vendor?.name ?? "Підрядник"}
            subtitle={`${item.user?.name ?? "—"} · ${item.city} · ${new Date(item.eventDate).toLocaleDateString("uk-UA")}`}
            right={
              <Badge
                label={statusUk(item.status)}
                tone={
                  item.status === "NEW"
                    ? "warn"
                    : item.status === "DONE"
                      ? "ok"
                      : "sage"
                }
              />
            }
          />
        )}
      />
    </Screen>
  );
}

function statusUk(s: RequestStatus) {
  if (s === "NEW") return "Нова";
  if (s === "CONTACTED") return "В роботі";
  if (s === "DONE") return "Готово";
  if (s === "CLOSED") return "Закрита";
  return s;
}

const styles = StyleSheet.create({
  screen: { paddingTop: 8 },
  list: { paddingBottom: 24 },
});
