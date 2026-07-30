import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  getAdminVendors,
  patchVendorFeatured,
  patchVendorStatus,
} from "@/lib/admin-api";
import { colors } from "@/theme";
import {
  Badge,
  Button,
  Card,
  Empty,
  ErrorBox,
  Input,
  Loading,
  Screen,
} from "@/ui";

type VendorRow = Awaited<ReturnType<typeof getAdminVendors>>[number];

export default function AdminVendorsScreen() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | undefined>();

  const vendorsQuery = useQuery({
    queryKey: ["admin-vendors", { q, status }],
    queryFn: () =>
      getAdminVendors({ q: q.trim() || undefined, status }),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      next,
    }: {
      id: string;
      next: "APPROVED" | "REJECTED" | "PENDING";
    }) => patchVendorStatus(id, { status: next }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-vendors"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const featuredMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      patchVendorFeatured(id, featured),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-vendors"] });
    },
  });

  if (vendorsQuery.isLoading) return <Loading />;
  if (vendorsQuery.error) {
    return (
      <Screen>
        <ErrorBox message={(vendorsQuery.error as Error).message} />
      </Screen>
    );
  }

  const items = vendorsQuery.data ?? [];

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Input
              placeholder="Пошук…"
              value={q}
              onChangeText={setQ}
            />
            <View style={styles.filters}>
              {(
                [
                  [undefined, "Усі"],
                  ["PENDING", "Очікують"],
                  ["APPROVED", "Схвалені"],
                  ["REJECTED", "Відхилені"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={label}
                  label={label}
                  variant={status === value ? "primary" : "ghost"}
                  onPress={() => setStatus(value)}
                />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<Empty title="Немає підрядників" />}
        refreshing={vendorsQuery.isRefetching}
        onRefresh={() => void vendorsQuery.refetch()}
        renderItem={({ item }) => (
          <VendorAdminCard
            item={item}
            busy={
              statusMutation.isPending || featuredMutation.isPending
            }
            onStatus={(next) =>
              statusMutation.mutate({ id: item.id, next })
            }
            onFeatured={() =>
              featuredMutation.mutate({
                id: item.id,
                featured: !item.featured,
              })
            }
          />
        )}
      />
    </Screen>
  );
}

function VendorAdminCard({
  item,
  busy,
  onStatus,
  onFeatured,
}: {
  item: VendorRow;
  busy: boolean;
  onStatus: (s: "APPROVED" | "REJECTED" | "PENDING") => void;
  onFeatured: () => void;
}) {
  return (
    <Card>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>
        {item.category?.name} · {item.city}
        {item.user?.email ? ` · ${item.user.email}` : ""}
      </Text>
      <View style={styles.badges}>
        <Badge
          label={statusUk(item.status)}
          tone={
            item.status === "APPROVED"
              ? "ok"
              : item.status === "PENDING"
                ? "warn"
                : "muted"
          }
        />
        {item.featured ? <Badge label="Топ" tone="ok" /> : null}
      </View>
      <View style={styles.actions}>
        {item.status !== "APPROVED" ? (
          <Button
            label="Схвалити"
            disabled={busy}
            onPress={() => onStatus("APPROVED")}
          />
        ) : null}
        {item.status !== "REJECTED" ? (
          <Button
            label="Відхилити"
            variant="danger"
            disabled={busy}
            onPress={() => onStatus("REJECTED")}
          />
        ) : null}
        <Button
          label={item.featured ? "Прибрати топ" : "В топ"}
          variant="ghost"
          disabled={busy || item.status !== "APPROVED"}
          onPress={onFeatured}
        />
      </View>
    </Card>
  );
}

function statusUk(s: string) {
  if (s === "APPROVED") return "Схвалено";
  if (s === "PENDING") return "Очікує";
  if (s === "REJECTED") return "Відхилено";
  return s;
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  list: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 8 },
  filters: { gap: 6, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "700", color: colors.ink },
  meta: { marginTop: 4, fontSize: 13, color: colors.inkSoft },
  badges: { flexDirection: "row", gap: 6, marginTop: 10, marginBottom: 10 },
  actions: { gap: 8 },
});
