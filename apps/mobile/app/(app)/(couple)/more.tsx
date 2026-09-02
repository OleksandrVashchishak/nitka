import * as Clipboard from "expo-clipboard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notify } from "@/lib/confirm";
import { href } from "@/lib/href";
import { createPartnerInvite, getMyWedding } from "@/lib/weddings-api";
import { colors, spacing } from "@/theme";
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  ListGroup,
  ListRow,
  Loading,
  ScreenHeader,
} from "@/ui";

const WEB_BASE = process.env.EXPO_PUBLIC_WEB_URL || "https://nitka.ua";
const APP_BASE =
  process.env.EXPO_PUBLIC_APP_URL || "http://localhost:8081";

function inviteUrl(path: string) {
  const base = WEB_BASE.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function mobileInviteUrl(token: string) {
  return `${APP_BASE.replace(/\/$/, "")}/partner-invite/${token}`;
}

export default function MoreScreen() {
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [mobileLink, setMobileLink] = useState<string | null>(null);

  const inviteMut = useMutation({
    mutationFn: createPartnerInvite,
    onSuccess: (data) => {
      const web = inviteUrl(data.path);
      const mobile = mobileInviteUrl(data.token);
      setInviteLink(web);
      setMobileLink(mobile);
      notify("Лінк готовий", "Надішли партнеру — діятиме 14 днів");
    },
  });

  if (weddingQ.isLoading) return <Loading />;

  const wedding = weddingQ.data;
  const members = wedding?.members ?? [];
  const myRole = wedding?.myRole ?? "OWNER";
  const isOwner = myRole === "OWNER";
  const partner = members.find((m) => m.role === "PARTNER");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Ще" subtitle="План дня та налаштування" />

        <ListGroup header="Планування">
          <ListRow
            icon="📅"
            title="План дня"
            subtitle="Таймінг подій"
            onPress={() => router.push(href("/(app)/(couple)/day-plan"))}
          />
          <ListRow
            icon="🪑"
            title="Розсадка"
            subtitle="Столи та місця"
            onPress={() => router.push(href("/(app)/(couple)/seating"))}
          />
          <ListRow
            icon="🌐"
            title="Весільний сайт"
            subtitle="Лінк і публікація"
            onPress={() => router.push(href("/(app)/(couple)/website"))}
          />
          <ListRow
            icon="✉️"
            title="Запрошення"
            subtitle="Тема, текст, обкладинка"
            onPress={() => router.push(href("/(app)/(couple)/invitations"))}
          />
          <ListRow
            icon="💍"
            title="Весілля"
            subtitle="Дата, місто, гості"
            onPress={() => router.push(href("/(app)/(couple)/wedding"))}
          />
          <ListRow
            icon="📖"
            title="Гайди й статті"
            onPress={() => router.push(href("/content"))}
            last
          />
        </ListGroup>

        {wedding ? (
          <Card>
            <Text style={styles.blockTitle}>Спільний доступ</Text>
            <Text style={styles.hint}>
              Один акаунт створює весілля, другий заходить по лінку.
            </Text>
            <Badge
              label={isOwner ? "Ти власник" : "Ти партнер"}
              tone="sage"
            />
            {members.length > 0 ? (
              <View style={styles.members}>
                {members.map((m) => (
                  <Text key={m.id} style={styles.member}>
                    {m.user.name} ·{" "}
                    {m.role === "OWNER" ? "власник" : "партнер"}
                  </Text>
                ))}
              </View>
            ) : null}

            {partner ? (
              <Text style={styles.ok}>
                Партнер уже в кабінеті: {partner.user.name} (
                {partner.user.email})
              </Text>
            ) : isOwner ? (
              <>
                <View style={{ height: 10 }} />
                <Button
                  label={inviteLink ? "Оновити лінк" : "Запросити партнера"}
                  loading={inviteMut.isPending}
                  onPress={() => inviteMut.mutate()}
                />
                {inviteLink ? (
                  <>
                    <Text style={styles.link} numberOfLines={2}>
                      {inviteLink}
                    </Text>
                    <Button
                      label="Копіювати web-лінк"
                      variant="ghost"
                      onPress={() =>
                        void Clipboard.setStringAsync(inviteLink).then(() =>
                          notify("Скопійовано", inviteLink),
                        )
                      }
                    />
                    {mobileLink ? (
                      <Button
                        label="Поділитись (mobile)"
                        variant="soft"
                        onPress={() =>
                          void Share.share({
                                                        message: `Запрошення fata.studio: ${mobileLink}`,
                            url: mobileLink,
                          })
                        }
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            ) : (
              <Text style={styles.hint}>
                Запрошувати може лише власник весілля.
              </Text>
            )}
            {inviteMut.isError ? (
              <ErrorBox
                message={
                  inviteMut.error instanceof Error
                    ? inviteMut.error.message
                    : "Помилка"
                }
              />
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  blockTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 6,
  },
  hint: { fontSize: 14, color: colors.inkSoft, marginBottom: 10, lineHeight: 20 },
  members: { marginTop: 10, gap: 4 },
  member: { fontSize: 14, color: colors.ink },
  ok: { marginTop: 10, fontSize: 14, color: colors.sage, fontWeight: "600" },
  link: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 13,
    color: colors.primary,
  },
});
