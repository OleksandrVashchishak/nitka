import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notify } from "@/lib/confirm";
import { INVITATION_THEMES } from "@/lib/invitation-themes";
import {
  getMyInvitation,
  invitationsEditorUrl,
  normalizeInvitationContent,
  upsertMyInvitation,
  type InvitationContent,
} from "@/lib/invitations-api";
import { uploadImage } from "@/lib/uploads-api";
import { getMyWedding } from "@/lib/weddings-api";
import { colors, radius, spacing } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import { InvitationCard } from "@/ui/invitation-card";
import {
  Button,
  Empty,
  ErrorBox,
  FormScroll,
  Input,
  ListGroup,
  ListRow,
  Loading,
} from "@/ui";

export default function InvitationsSoftScreen() {
  const qc = useQueryClient();
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const inviteQ = useQuery({
    queryKey: ["invitation"],
    queryFn: getMyInvitation,
  });

  const [templateId, setTemplateId] = useState("sage-linen");
  const [content, setContent] = useState<InvitationContent>(
    normalizeInvitationContent(),
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = inviteQ.data;
    if (!data || hydrated) return;
    setTemplateId(data.invitation.templateId || "sage-linen");
    setContent(normalizeInvitationContent(data.invitation.content));
    setHydrated(true);
  }, [inviteQ.data, hydrated]);

  const saveMut = useMutation({
    mutationFn: () =>
      upsertMyInvitation({
        templateId,
        content: normalizeInvitationContent(content),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invitation"] });
      setError(null);
      notify("Збережено", "Гості побачать оновлене запрошення");
    },
    onError: (e) => {
      setError(e instanceof Error ? e.message : "Не збережено");
    },
  });

  function patch(p: Partial<InvitationContent>) {
    setContent((s) => ({ ...s, ...p }));
  }

  async function pickCover() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      notify("Нема доступу", "Дозволь галерею в налаштуваннях");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const up = await uploadImage(result.assets[0].uri, "invite-cover.jpg");
      patch({ coverImageUrl: up.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не завантажено");
    } finally {
      setUploading(false);
    }
  }

  if (weddingQ.isLoading || inviteQ.isLoading) return <Loading />;

  if (!weddingQ.data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <BackHeader title="Запрошення" />
        <Empty title="Спочатку створи весілля" hint="На вкладці Дім" />
      </SafeAreaView>
    );
  }

  if (inviteQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <BackHeader title="Запрошення" />
        <ErrorBox
          message={
            inviteQ.error instanceof Error ? inviteQ.error.message : "Помилка"
          }
        />
      </SafeAreaView>
    );
  }

  const data = inviteQ.data;
  const editorUrl = invitationsEditorUrl();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <BackHeader title="Запрошення" />
      <FormScroll contentContainerStyle={styles.pad}>
        <Text style={styles.hint}>
          Тема, текст і обкладинка — гості бачать це на сторінці відповіді.
          {data?.guestsTotal
            ? ` У списку ${data.guestsTotal} гостей.`
            : ""}
        </Text>

        {error ? <ErrorBox message={error} /> : null}

        <Text style={styles.section}>Тема</Text>
        <View style={styles.themes}>
          {INVITATION_THEMES.map((t) => {
            const on = templateId === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTemplateId(t.id)}
                style={[
                  styles.themeChip,
                  { backgroundColor: t.colors.bg, borderColor: t.colors.accent },
                  on && styles.themeChipOn,
                ]}
              >
                <Text style={[styles.themeName, { color: t.colors.text }]}>
                  {t.name}
                </Text>
                <Text style={[styles.themeDesc, { color: t.colors.muted }]}>
                  {t.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Превʼю</Text>
        <InvitationCard
          templateId={templateId}
          content={normalizeInvitationContent(content)}
          compact
        />

        <Text style={styles.section}>Обкладинка</Text>
        {content.coverImageUrl ? (
          <Image source={{ uri: content.coverImageUrl }} style={styles.cover} />
        ) : null}
        <View style={styles.row}>
          <Button
            label={content.coverImageUrl ? "Змінити фото" : "Додати фото"}
            variant="soft"
            loading={uploading}
            onPress={() => void pickCover()}
          />
          {content.coverImageUrl ? (
            <Button
              label="Прибрати"
              variant="ghost"
              onPress={() => patch({ coverImageUrl: "" })}
            />
          ) : null}
        </View>

        <Text style={styles.section}>Текст</Text>
        <Input
          label="Заголовок (імена)"
          value={content.headline}
          onChangeText={(v) => patch({ headline: v })}
        />
        <Input
          label="Відкриття"
          value={content.opener}
          onChangeText={(v) => patch({ opener: v })}
        />
        <Input
          label="Текст"
          value={content.body}
          onChangeText={(v) => patch({ body: v })}
          multiline
        />
        <Input
          label="Дата"
          value={content.dateLabel}
          onChangeText={(v) => patch({ dateLabel: v })}
          placeholder="напр. 12 вересня 2026"
        />
        <Input
          label="Час"
          value={content.timeLabel}
          onChangeText={(v) => patch({ timeLabel: v })}
          placeholder="16:00"
        />
        <Input
          label="Місце"
          value={content.venue}
          onChangeText={(v) => patch({ venue: v })}
        />
        <Input
          label="Адреса"
          value={content.address}
          onChangeText={(v) => patch({ address: v })}
        />
        <Input
          label="Дрес-код"
          value={content.dressCode}
          onChangeText={(v) => patch({ dressCode: v })}
        />
        <Input
          label="Нотатка про відповідь"
          value={content.rsvpNote}
          onChangeText={(v) => patch({ rsvpNote: v })}
        />

        <ListGroup header="Ще">
          <ListRow
            title="Посилання на сайт у запрошенні"
            subtitle={content.showWebsiteLink ? "Увімкнено" : "Вимкнено"}
            onPress={() => patch({ showWebsiteLink: !content.showWebsiteLink })}
          />
          <ListRow
            title="Повний редактор на десктопі"
            subtitle="Більше превʼю й типографіки"
            onPress={() => void Linking.openURL(editorUrl)}
            last
          />
        </ListGroup>

        <Button
          label="Зберегти"
          loading={saveMut.isPending}
          onPress={() => saveMut.mutate()}
        />
        <View style={{ height: 32 }} />
      </FormScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: spacing.lg, gap: 10 },
  hint: { color: colors.inkMuted, fontSize: 14, lineHeight: 20, marginBottom: 4 },
  section: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 13,
    fontWeight: "700",
    color: colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  themes: { gap: 8 },
  themeChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  themeChipOn: {
    borderWidth: 2,
  },
  themeName: { fontSize: 16, fontWeight: "700" },
  themeDesc: { marginTop: 2, fontSize: 12 },
  cover: {
    width: "100%",
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colors.mist,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
