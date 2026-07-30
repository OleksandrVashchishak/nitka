import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { getContentPost } from "@/lib/misc-api";
import { ContentBody } from "@/ui/content-body";
import { ErrorBox, Loading, Screen, Subtitle, Title } from "@/ui";

export default function ContentPostScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const postQuery = useQuery({
    queryKey: ["content-post", slug],
    queryFn: () => getContentPost(slug!),
    enabled: !!slug,
  });

  if (postQuery.isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Стаття", headerShown: true }} />
        <Loading />
      </>
    );
  }

  if (postQuery.error || !postQuery.data) {
    return (
      <>
        <Stack.Screen options={{ title: "Стаття", headerShown: true }} />
        <Screen>
          <ErrorBox
            message={(postQuery.error as Error)?.message || "Не знайдено"}
          />
        </Screen>
      </>
    );
  }

  const post = postQuery.data;

  return (
    <>
      <Stack.Screen options={{ title: post.title, headerShown: true }} />
      <Screen style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Title>{post.title}</Title>
          {post.excerpt ? <Subtitle>{post.excerpt}</Subtitle> : null}
          <ContentBody body={post.body} />
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 40 },
});
