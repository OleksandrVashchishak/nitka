import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  adminCreatePost,
  adminCreateTopic,
  adminDeletePost,
  adminDeleteTopic,
  adminListPosts,
  adminListTopics,
  adminUpdatePostStatus,
} from "@/lib/admin-content-api";
import { colors } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import {
  Badge,
  Button,
  Card,
  Empty,
  ErrorBox,
  Input,
  Loading,
  Subtitle,
  Title,
} from "@/ui";

export default function AdminContentScreen() {
  const qc = useQueryClient();
  const topicsQ = useQuery({
    queryKey: ["admin-content-topics"],
    queryFn: adminListTopics,
  });
  const postsQ = useQuery({
    queryKey: ["admin-content-posts"],
    queryFn: () => adminListPosts(),
  });

  const [topicName, setTopicName] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [topicId, setTopicId] = useState("");

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin-content-topics"] });
    void qc.invalidateQueries({ queryKey: ["admin-content-posts"] });
  };

  const createTopicMut = useMutation({
    mutationFn: () => adminCreateTopic({ name: topicName.trim() }),
    onSuccess: () => {
      setTopicName("");
      invalidate();
    },
  });

  const createPostMut = useMutation({
    mutationFn: () =>
      adminCreatePost({
        title: postTitle.trim(),
        excerpt: postExcerpt.trim() || undefined,
        topicId: topicId || topicsQ.data?.[0]?.id,
        status: "DRAFT",
        kind: "ARTICLE",
      }),
    onSuccess: () => {
      setPostTitle("");
      setPostExcerpt("");
      invalidate();
    },
  });

  if (topicsQ.isLoading || postsQ.isLoading) return <Loading />;

  const topics = topicsQ.data ?? [];
  const posts = postsQ.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BackHeader title="Контент" />
      <ScrollView contentContainerStyle={styles.pad}>
        <Title>Контент</Title>
        <Subtitle>Теми й пости (без EditorJS — чернетки)</Subtitle>

        {topicsQ.error || postsQ.error ? (
          <ErrorBox
            message={
              ((topicsQ.error || postsQ.error) as Error)?.message ?? "Помилка"
            }
          />
        ) : null}

        <Text style={styles.section}>Теми</Text>
        {topics.length === 0 ? <Empty title="Немає тем" /> : null}
        {topics.map((t) => (
          <Card key={t.id}>
            <Text style={styles.rowTitle}>{t.name}</Text>
            <Text style={styles.rowSub}>{t.slug}</Text>
            <Button
              label="Вибрати для поста"
              variant="ghost"
              onPress={() => setTopicId(t.id)}
            />
            <Button
              label="Видалити"
              variant="danger"
              onPress={() =>
                adminDeleteTopic(t.id).then(invalidate).catch(() => undefined)
              }
            />
          </Card>
        ))}
        <Input
          label="Нова тема"
          value={topicName}
          onChangeText={setTopicName}
        />
        <Button
          label="Додати тему"
          disabled={!topicName.trim()}
          loading={createTopicMut.isPending}
          onPress={() => createTopicMut.mutate()}
        />

        <Text style={[styles.section, { marginTop: 20 }]}>Пости</Text>
        {topicId ? (
          <Text style={styles.rowSub}>Тема для нового: {topicId}</Text>
        ) : null}
        <Input label="Заголовок" value={postTitle} onChangeText={setPostTitle} />
        <Input
          label="Короткий опис"
          value={postExcerpt}
          onChangeText={setPostExcerpt}
        />
        <Button
          label="Створити чернетку"
          disabled={!postTitle.trim() || !(topicId || topics[0]?.id)}
          loading={createPostMut.isPending}
          onPress={() => createPostMut.mutate()}
        />
        {createPostMut.isError ? (
          <ErrorBox
            message={
              createPostMut.error instanceof Error
                ? createPostMut.error.message
                : "Помилка"
            }
          />
        ) : null}

        <View style={{ height: 12 }} />
        {posts.length === 0 ? <Empty title="Немає постів" /> : null}
        {posts.map((p) => (
          <Card key={p.id}>
            <View style={styles.postHead}>
              <Text style={styles.rowTitle}>{p.title}</Text>
              <Badge
                label={p.status}
                tone={p.status === "PUBLISHED" ? "ok" : "muted"}
              />
            </View>
            <Text style={styles.rowSub}>{p.slug}</Text>
            {p.status !== "PUBLISHED" ? (
              <Button
                label="Опублікувати"
                onPress={() =>
                  adminUpdatePostStatus(p.id, "PUBLISHED")
                    .then(invalidate)
                    .catch(() => undefined)
                }
              />
            ) : (
              <Button
                label="В чернетку"
                variant="ghost"
                onPress={() =>
                  adminUpdatePostStatus(p.id, "DRAFT")
                    .then(invalidate)
                    .catch(() => undefined)
                }
              />
            )}
            <Button
              label="Видалити"
              variant="danger"
              onPress={() =>
                adminDeletePost(p.id).then(invalidate).catch(() => undefined)
              }
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: 16, paddingBottom: 48 },
  section: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
    marginTop: 8,
  },
  rowTitle: { fontSize: 15, fontWeight: "600", color: colors.ink },
  rowSub: { marginTop: 4, marginBottom: 10, fontSize: 13, color: colors.inkSoft },
  postHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
});
