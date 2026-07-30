import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  createAdminCategory,
  deleteAdminCategory,
  deleteAdminReview,
  getAdminCategories,
  getAdminReviews,
} from "@/lib/admin-api";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { colors } from "@/theme";
import {
  Button,
  Card,
  ErrorBox,
  Input,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function AdminMoreScreen() {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [catError, setCatError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });

  const reviewsQuery = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });

  const createCat = useMutation({
    mutationFn: () =>
      createAdminCategory({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
      }),
    onSuccess: () => {
      setName("");
      setSlug("");
      setCatError(null);
      void qc.invalidateQueries({ queryKey: ["admin-categories"] });
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: Error) => setCatError(e.message),
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-categories"] });
      void qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => deleteAdminReview(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  if (categoriesQuery.isLoading || reviewsQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Title>Ще</Title>
        <Subtitle>Категорії, контент, відгуки, вихід</Subtitle>

        <Button
          label="Контент (теми / пости)"
          onPress={() => router.push(href("/(app)/(admin)/content"))}
        />

        <Text style={styles.section}>Категорії</Text>
        {categoriesQuery.error ? (
          <ErrorBox message={(categoriesQuery.error as Error).message} />
        ) : null}
        {(categoriesQuery.data ?? []).map((c) => (
          <Card key={c.id}>
            <Text style={styles.rowTitle}>{c.name}</Text>
            <Text style={styles.rowSub}>{c.slug}</Text>
            <Button
              label="Видалити"
              variant="danger"
              loading={
                deleteCat.isPending && deleteCat.variables === c.id
              }
              onPress={() => deleteCat.mutate(c.id)}
            />
          </Card>
        ))}

        <Input
          label="Нова категорія"
          placeholder="Назва"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Slug"
          placeholder="авто з назви"
          value={slug}
          onChangeText={setSlug}
          autoCapitalize="none"
        />
        {catError ? <ErrorBox message={catError} /> : null}
        <Button
          label="Додати категорію"
          loading={createCat.isPending}
          disabled={!name.trim()}
          onPress={() => createCat.mutate()}
        />

        <Text style={[styles.section, { marginTop: 24 }]}>Відгуки</Text>
        {reviewsQuery.error ? (
          <ErrorBox message={(reviewsQuery.error as Error).message} />
        ) : null}
        {(reviewsQuery.data ?? []).length === 0 ? (
          <Text style={styles.rowSub}>Немає відгуків</Text>
        ) : (
          (reviewsQuery.data ?? []).map((r) => (
            <Card key={r.id}>
              <Text style={styles.rowTitle}>
                {r.vendor.name} · {r.rating}★
              </Text>
              <Text style={styles.rowSub}>
                {r.user.name}: {r.text}
              </Text>
              <Button
                label="Видалити"
                variant="danger"
                loading={
                  deleteReview.isPending && deleteReview.variables === r.id
                }
                onPress={() => deleteReview.mutate(r.id)}
              />
            </Card>
          ))
        )}

        <View style={styles.logout}>
          <Button
            label="Вийти"
            variant="ghost"
            onPress={() => void onLogout()}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 48 },
  section: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
    marginTop: 8,
  },
  rowTitle: { fontSize: 15, fontWeight: "600", color: colors.ink },
  rowSub: { marginTop: 4, marginBottom: 10, fontSize: 13, color: colors.inkSoft },
  logout: { marginTop: 28 },
});
