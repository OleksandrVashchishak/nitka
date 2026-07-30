import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { href } from "@/lib/href";
import { getContentPosts, getContentTopics } from "@/lib/misc-api";
import type { ContentPost } from "@/lib/types";
import { colors } from "@/theme";
import {
  Empty,
  ErrorBox,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function ContentIndexScreen() {
  const [topic, setTopic] = useState<string | undefined>();

  const topicsQuery = useQuery({
    queryKey: ["content-topics"],
    queryFn: getContentTopics,
  });

  const postsQuery = useQuery({
    queryKey: ["content-posts", topic],
    queryFn: () => getContentPosts({ topic }),
  });

  const topics = topicsQuery.data ?? [];
  const posts = postsQuery.data?.items ?? [];

  if (topicsQuery.isLoading && postsQuery.isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Статті", headerShown: true }} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Статті", headerShown: true }} />
      <Screen style={styles.screen}>
        {(topicsQuery.error || postsQuery.error) && (
          <ErrorBox
            message={
              (postsQuery.error as Error)?.message ||
              (topicsQuery.error as Error)?.message ||
              "Помилка"
            }
          />
        )}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <Title>Журнал</Title>
              <Subtitle>Поради та ідеї для весілля</Subtitle>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                <Chip
                  label="Усі"
                  active={!topic}
                  onPress={() => setTopic(undefined)}
                />
                {topics.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name || t.title || t.slug}
                    active={topic === t.slug}
                    onPress={() => setTopic(t.slug)}
                  />
                ))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={
            postsQuery.isLoading ? null : (
              <Empty title="Поки порожньо" hint="Скоро зʼявляться статті" />
            )
          }
          renderItem={({ item }) => <PostRow post={item} />}
          refreshing={postsQuery.isRefetching}
          onRefresh={() => void postsQuery.refetch()}
        />
      </Screen>
    </>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function PostRow({ post }: { post: ContentPost }) {
  return (
    <Link href={href(`/content/${post.slug}`)} asChild>
      <Pressable style={styles.row}>
        <Text style={styles.rowTitle}>{post.title}</Text>
        <Text style={styles.rowSub} numberOfLines={2}>
          {post.excerpt}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  list: { paddingBottom: 24 },
  chips: { gap: 8, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  row: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: colors.ink },
  rowSub: { marginTop: 6, fontSize: 13, color: colors.inkSoft, lineHeight: 18 },
});
