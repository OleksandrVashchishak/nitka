import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { getAdminUsers, patchAdminUser } from "@/lib/admin-api";
import {
  Badge,
  Button,
  Empty,
  ErrorBox,
  Input,
  Loading,
  Row,
  Screen,
} from "@/ui";

export default function AdminUsersScreen() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin-users", q],
    queryFn: () => getAdminUsers({ q: q.trim() || undefined }),
  });

  const blockMutation = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      patchAdminUser(id, { blocked }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (usersQuery.isLoading) return <Loading />;
  if (usersQuery.error) {
    return (
      <Screen>
        <ErrorBox message={(usersQuery.error as Error).message} />
      </Screen>
    );
  }

  const items = usersQuery.data ?? [];

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Input placeholder="Пошук…" value={q} onChangeText={setQ} />
          </View>
        }
        ListEmptyComponent={<Empty title="Немає користувачів" />}
        refreshing={usersQuery.isRefetching}
        onRefresh={() => void usersQuery.refetch()}
        renderItem={({ item }) => (
          <Row
            title={item.name}
            subtitle={`${item.email} · ${item.role}`}
            right={
              <View style={styles.right}>
                {item.blocked ? <Badge label="Блок" tone="warn" /> : null}
                <Button
                  label={item.blocked ? "Розблокувати" : "Заблокувати"}
                  variant={item.blocked ? "ghost" : "danger"}
                  loading={
                    blockMutation.isPending &&
                    blockMutation.variables?.id === item.id
                  }
                  onPress={() =>
                    blockMutation.mutate({
                      id: item.id,
                      blocked: !item.blocked,
                    })
                  }
                />
              </View>
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  list: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 4 },
  right: { alignItems: "flex-end", gap: 6, maxWidth: 140 },
});
