import * as Clipboard from "expo-clipboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notify } from "@/lib/confirm";
import {
  getMyWebsite,
  upsertMyWebsite,
  websiteEditorUrl,
  websitePublicUrl,
} from "@/lib/website-api";
import { getMyWedding } from "@/lib/weddings-api";
import { colors, radius, spacing } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import {
  Badge,
  Button,
  Empty,
  ErrorBox,
  FormScroll,
  Input,
  ListGroup,
  ListRow,
  Loading,
} from "@/ui";

function slugify(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function WebsiteSoftScreen() {
  const qc = useQueryClient();
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const siteQ = useQuery({ queryKey: ["website"], queryFn: getMyWebsite });

  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = siteQ.data;
    if (!data) return;
    setSlug(data.site?.slug ?? data.suggestedSlug ?? "");
  }, [siteQ.data]);

  const saveMut = useMutation({
    mutationFn: upsertMyWebsite,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["website"] });
      setError(null);
    },
    onError: (e) => {
      setError(e instanceof Error ? e.message : "Не збережено");
    },
  });

  if (weddingQ.isLoading || siteQ.isLoading) return <Loading />;

  if (!weddingQ.data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <BackHeader title="Сайт" />
        <Empty title="Спочатку створи весілля" hint="На вкладці Дім" />
      </SafeAreaView>
    );
  }

  if (siteQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <BackHeader title="Сайт" />
        <ErrorBox
          message={
            siteQ.error instanceof Error ? siteQ.error.message : "Помилка"
          }
        />
      </SafeAreaView>
    );
  }

  const data = siteQ.data;
  const site = data?.site ?? null;
  const publicUrl = site ? websitePublicUrl(site.publicPath || site.slug) : null;
  const editorUrl = websiteEditorUrl();
  const couple = site?.wedding
    ? `${site.wedding.partnerOneName} & ${site.wedding.partnerTwoName}`
    : `${weddingQ.data.partnerOneName} & ${weddingQ.data.partnerTwoName}`;

  async function copyLink() {
    if (!publicUrl) return;
    await Clipboard.setStringAsync(publicUrl);
    notify(
      "Скопійовано",
      site?.published
        ? "Лінк на сайт"
        : "Лінк скопійовано — опублікуй, щоб гості бачили",
    );
  }

  async function shareLink() {
    if (!publicUrl) return;
    try {
      await Share.share({
        message: `Наш весільний сайт: ${publicUrl}`,
        url: publicUrl,
      });
    } catch {
      await copyLink();
    }
  }

  function createSite() {
    const next = slugify(slug || data?.suggestedSlug || "wedding");
    if (next.length < 2) {
      setError("Slug мінімум 2 символи (латиниця, цифри, дефіс)");
      return;
    }
    setSlug(next);
    saveMut.mutate({
      slug: next,
      templateId: data?.templates[0]?.id ?? "classic",
      published: false,
    });
  }

  function togglePublish() {
    if (!site) return;
    saveMut.mutate({ published: !site.published });
  }

  function saveSlug() {
    if (!site) return;
    const next = slugify(slug);
    if (next.length < 2) {
      setError("Slug мінімум 2 символи");
      return;
    }
    saveMut.mutate({ slug: next });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BackHeader title="Весільний сайт" />
      <FormScroll contentContainerStyle={styles.pad}>
        <Text style={styles.title}>Сайт для гостей</Text>
        <Text style={styles.sub}>
          Дизайн і тексти зручніше правити на компʼютері. Тут — лінк,
          публікація і швидкий доступ.
        </Text>

        <View style={styles.hero}>
          <Text style={styles.heroCouple}>{couple}</Text>
          {site ? (
            <Badge
              label={site.published ? "Опубліковано" : "Чернетка"}
              tone={site.published ? "ok" : "muted"}
            />
          ) : (
            <Badge label="Ще не створено" tone="muted" />
          )}
        </View>

        {!site ? (
          <>
            <Input
              label="Адреса сайту (slug)"
              value={slug}
              onChangeText={setSlug}
              autoCapitalize="none"
              placeholder={data?.suggestedSlug ?? "maria-andriy"}
            />
            <Text style={styles.hint}>
              Буде:{" "}
              {websitePublicUrl(slugify(slug || data?.suggestedSlug || "…"))}
            </Text>
            {error ? <ErrorBox message={error} /> : null}
            <Button
              label="Створити сайт"
              loading={saveMut.isPending}
              onPress={createSite}
            />
          </>
        ) : (
          <>
            <ListGroup header="Лінк">
              <ListRow
                title={publicUrl ?? ""}
                subtitle={
                  site.published
                    ? "Доступний гостям"
                    : "Поки чернетка — гості не побачать"
                }
                last
              />
            </ListGroup>

            <Button label="Скопіювати лінк" onPress={() => void copyLink()} />
            <View style={{ height: 8 }} />
            <Button
              label="Поділитись"
              variant="soft"
              onPress={() => void shareLink()}
            />

            <View style={{ height: 16 }} />

            <ListGroup header="Публікація">
              <ListRow
                title={site.published ? "Зняти з публікації" : "Опублікувати"}
                subtitle={
                  site.published
                    ? "Сайт знову стане чернеткою"
                    : "Гості зможуть відкрити лінк"
                }
                onPress={togglePublish}
                last
              />
            </ListGroup>

            <Input
              label="Змінити slug"
              value={slug}
              onChangeText={setSlug}
              autoCapitalize="none"
            />
            <Button
              label="Зберегти адресу"
              variant="ghost"
              loading={saveMut.isPending}
              onPress={saveSlug}
            />
            {error ? <ErrorBox message={error} /> : null}

            <View style={styles.deskCard}>
              <Text style={styles.deskTitle}>Редагувати на десктопі</Text>
              <Text style={styles.deskBody}>
                Повний редактор (шаблони, історія, розклад, галерея) — у браузері
                на компʼютері.
              </Text>
              <Button
                label="Відкрити редактор"
                onPress={() => void Linking.openURL(editorUrl)}
              />
              <View style={{ height: 8 }} />
              <Button
                label="Скопіювати лінк редактора"
                variant="ghost"
                onPress={() =>
                  void Clipboard.setStringAsync(editorUrl).then(() =>
                    notify("Скопійовано", editorUrl),
                  )
                }
              />
            </View>
          </>
        )}

        {saveMut.isError && !error ? (
          <ErrorBox
            message={
              saveMut.error instanceof Error
                ? saveMut.error.message
                : "Помилка збереження"
            }
          />
        ) : null}
      </FormScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { padding: spacing.md, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
    marginBottom: 18,
  },
  hero: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    gap: 10,
  },
  heroCouple: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  hint: {
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: 12,
    marginTop: -4,
  },
  deskCard: {
    marginTop: 20,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 18,
  },
  deskTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 6,
  },
  deskBody: {
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 20,
    marginBottom: 14,
  },
});
