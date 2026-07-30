import { useMutation, useQuery } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import {
  clearPendingPartnerInvite,
  savePendingPartnerInvite,
} from "@/lib/partner-invite-pending";
import {
  acceptPartnerInvite,
  getPartnerInvitePreview,
} from "@/lib/weddings-api";
import { colors } from "@/theme";
import {
  Button,
  Card,
  ErrorBox,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function PartnerInviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const user = useAuthStore((s) => s.user);
  const isCouple = user?.role === "COUPLE";

  const previewQuery = useQuery({
    queryKey: ["partner-invite", token],
    queryFn: () => getPartnerInvitePreview(token!),
    enabled: !!token,
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptPartnerInvite(token!),
    onSuccess: async () => {
      await clearPendingPartnerInvite();
      router.replace(href("/(app)/(couple)"));
    },
  });

  async function goAuth(path: "/login" | "/register") {
    if (token) await savePendingPartnerInvite(token);
    router.push(path);
  }

  if (previewQuery.isLoading) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Запрошення партнера", headerShown: true }}
        />
        <Loading />
      </>
    );
  }

  if (previewQuery.error || !previewQuery.data) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Запрошення партнера", headerShown: true }}
        />
        <Screen>
          <ErrorBox
            message={
              (previewQuery.error as Error)?.message ||
              "Запрошення недійсне"
            }
          />
        </Screen>
      </>
    );
  }

  const preview = previewQuery.data;

  return (
    <>
      <Stack.Screen
        options={{ title: "Запрошення партнера", headerShown: true }}
      />
      <Screen>
        <Title>Спільне планування</Title>
        <Subtitle>
          Тебе запрошують до весілля {preview.coupleName}
        </Subtitle>

        <Card>
          <Text style={styles.row}>
            Пара:{" "}
            <Text style={styles.strong}>{preview.coupleName}</Text>
          </Text>
          <Text style={styles.row}>
            Місто: <Text style={styles.strong}>{preview.city || "—"}</Text>
          </Text>
          <Text style={styles.row}>
            Дата:{" "}
            <Text style={styles.strong}>
              {preview.date
                ? new Date(preview.date).toLocaleDateString("uk-UA")
                : "—"}
            </Text>
          </Text>
        </Card>

        {!user ? (
          <View style={styles.block}>
            <Text style={styles.hint}>
              Увійди або зареєструйся як пара, щоб прийняти запрошення.
            </Text>
            <Button label="Увійти" onPress={() => void goAuth("/login")} />
            <Button
              label="Реєстрація"
              variant="ghost"
              onPress={() => void goAuth("/register")}
            />
          </View>
        ) : !isCouple ? (
          <ErrorBox message="Прийняти може лише акаунт пари (COUPLE)." />
        ) : (
          <View style={styles.block}>
            {acceptMutation.error ? (
              <ErrorBox message={(acceptMutation.error as Error).message} />
            ) : null}
            <Button
              label="Прийняти запрошення"
              loading={acceptMutation.isPending}
              onPress={() => acceptMutation.mutate()}
            />
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  row: { fontSize: 15, color: colors.inkSoft, marginBottom: 6 },
  strong: { fontWeight: "700", color: colors.ink },
  block: { marginTop: 8, gap: 10 },
  hint: { color: colors.inkSoft, marginBottom: 8, lineHeight: 20 },
});
