import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { addFavorite, getFavorites, removeFavorite } from "@/lib/favorites-api";
import { href } from "@/lib/href";
import {
  createReview,
  getMyReview,
  updateReview,
} from "@/lib/misc-api";
import { createRequest } from "@/lib/requests-api";
import { useAuthStore } from "@/lib/auth-store";
import { getVendor } from "@/lib/vendors-api";
import { getMyWedding } from "@/lib/weddings-api";
import { colors } from "@/theme";
import { DateField } from "@/ui/date-field";
import { Sheet } from "@/ui/sheet";
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  Input,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function VendorDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const isCouple = user?.role === "COUPLE";

  const vendorQuery = useQuery({
    queryKey: ["vendor", slug],
    queryFn: () => getVendor(slug!),
    enabled: !!slug,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isCouple,
  });

  const weddingQuery = useQuery({
    queryKey: ["wedding"],
    queryFn: getMyWedding,
    enabled: isCouple,
  });

  const myReviewQuery = useQuery({
    queryKey: ["my-review", vendorQuery.data?.id],
    queryFn: () => getMyReview(vendorQuery.data!.id),
    enabled: isCouple && !!vendorQuery.data?.id,
  });

  const vendor = vendorQuery.data;
  const isFavorite = !!favoritesQuery.data?.some(
    (f) => f.vendor.id === vendor?.id,
  );

  const [showRequest, setShowRequest] = useState(false);
  const [reqForm, setReqForm] = useState({
    eventDate: "",
    city: "",
    guests: "",
    budget: "",
    message: "",
  });
  const [reqMsg, setReqMsg] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!isCouple || prefilled || !weddingQuery.data) return;
    const w = weddingQuery.data;
    setReqForm((s) => ({
      ...s,
      eventDate: w.date?.slice(0, 10) || s.eventDate,
      city: w.city || s.city,
      guests: String(w.guests || s.guests || ""),
      budget: String(w.budget || s.budget || ""),
    }));
    setPrefilled(true);
  }, [isCouple, weddingQuery.data, prefilled]);

  const [reviewRating, setReviewRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [reviewPrefilled, setReviewPrefilled] = useState(false);

  useEffect(() => {
    const mine = myReviewQuery.data;
    if (!mine || reviewPrefilled) return;
    setReviewRating(String(mine.rating));
    setReviewText(mine.text);
    setReviewPrefilled(true);
  }, [myReviewQuery.data, reviewPrefilled]);

  const favMutation = useMutation({
    mutationFn: async () => {
      if (!vendor) return;
      if (isFavorite) await removeFavorite(vendor.id);
      else await addFavorite(vendor.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
      void qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });

  const requestMutation = useMutation({
    mutationFn: () =>
      createRequest({
        vendorId: vendor!.id,
        eventDate: reqForm.eventDate,
        city: reqForm.city,
        guests: Number(reqForm.guests) || 0,
        budget: Number(reqForm.budget) || 0,
        message: reqForm.message,
      }),
    onSuccess: () => {
      setReqMsg("Заявку надіслано");
      void qc.invalidateQueries({ queryKey: ["requests"] });
      void qc.invalidateQueries({ queryKey: ["pipeline"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => setReqMsg(e.message),
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const rating = Number(reviewRating) || 5;
      const text = reviewText;
      if (myReviewQuery.data?.id) {
        return updateReview(myReviewQuery.data.id, { rating, text });
      }
      return createReview({
        vendorId: vendor!.id,
        rating,
        text,
      });
    },
    onSuccess: () => {
      setReviewMsg(
        myReviewQuery.data?.id ? "Відгук оновлено" : "Відгук збережено",
      );
      void qc.invalidateQueries({ queryKey: ["vendor", slug] });
      void qc.invalidateQueries({
        queryKey: ["my-review", vendor?.id],
      });
    },
    onError: (e: Error) => setReviewMsg(e.message),
  });

  if (vendorQuery.isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Підрядник", headerShown: true }} />
        <Loading />
      </>
    );
  }

  if (vendorQuery.error || !vendor) {
    return (
      <>
        <Stack.Screen options={{ title: "Підрядник", headerShown: true }} />
        <Screen>
          <ErrorBox
            message={(vendorQuery.error as Error)?.message || "Не знайдено"}
          />
        </Screen>
      </>
    );
  }

  const priceLabel =
    vendor.priceTo != null
      ? `${vendor.priceFrom}–${vendor.priceTo} ₴`
      : `від ${vendor.priceFrom} ₴`;

  return (
    <>
      <Stack.Screen options={{ title: vendor.name, headerShown: true }} />
      <Screen style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          {vendor.photos?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gallery}
            >
              {vendor.photos.map((ph) => (
                <Image
                  key={ph.id}
                  source={{ uri: ph.url }}
                  style={styles.galleryImg}
                />
              ))}
            </ScrollView>
          ) : null}

          <Title>{vendor.name}</Title>
          {vendor.tagline ? <Subtitle>{vendor.tagline}</Subtitle> : null}
          <View style={styles.meta}>
            <Badge label={vendor.category?.name ?? "—"} />
            <Badge label={`${vendor.rating.toFixed(1)}★`} />
            {vendor.featured ? <Badge label="Топ" tone="ok" /> : null}
          </View>
          <Text style={styles.city}>
            {vendor.city} · {priceLabel}
          </Text>
          {vendor.styles?.length ? (
            <View style={styles.meta}>
              {vendor.styles.slice(0, 6).map((s) => (
                <Badge key={s} label={s} tone="muted" />
              ))}
            </View>
          ) : null}
          <Text style={styles.desc}>{vendor.description}</Text>

          {(vendor.yearsInBusiness ||
            vendor.teamSize ||
            vendor.responseTime ||
            vendor.availabilityNote) && (
            <Card>
              <Text style={styles.sectionTitle}>Деталі</Text>
              {vendor.yearsInBusiness ? (
                <Text style={styles.fact}>
                  Досвід: {vendor.yearsInBusiness} р.
                </Text>
              ) : null}
              {vendor.teamSize ? (
                <Text style={styles.fact}>Команда: {vendor.teamSize}</Text>
              ) : null}
              {vendor.responseTime ? (
                <Text style={styles.fact}>
                  Відповідь: {vendor.responseTime}
                </Text>
              ) : null}
              {vendor.bookingLeadTime ? (
                <Text style={styles.fact}>
                  Бронювання: {vendor.bookingLeadTime}
                </Text>
              ) : null}
              {vendor.availabilityNote ? (
                <Text style={styles.fact}>{vendor.availabilityNote}</Text>
              ) : null}
            </Card>
          )}

          {vendor.dealTitle ? (
            <Card>
              <Text style={styles.sectionTitle}>{vendor.dealTitle}</Text>
              {vendor.dealDescription ? (
                <Text style={styles.reviewText}>{vendor.dealDescription}</Text>
              ) : null}
            </Card>
          ) : null}

          <View style={styles.links}>
            {vendor.website ? (
              <Button
                label="Сайт"
                variant="ghost"
                onPress={() => void Linking.openURL(vendor.website!)}
              />
            ) : null}
            {vendor.instagram ? (
              <Button
                label="Instagram"
                variant="ghost"
                onPress={() =>
                  void Linking.openURL(
                    vendor.instagram!.startsWith("http")
                      ? vendor.instagram!
                      : `https://instagram.com/${vendor.instagram!.replace(/^@/, "")}`,
                  )
                }
              />
            ) : null}
            {vendor.phone ? (
              <Button
                label="Подзвонити"
                variant="ghost"
                onPress={() => void Linking.openURL(`tel:${vendor.phone}`)}
              />
            ) : null}
          </View>

          {vendor.packages?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Пакети</Text>
              {vendor.packages.map((pkg) => (
                <Card key={pkg.id}>
                  <View style={styles.pkgHead}>
                    <Text style={styles.pkgTitle}>{pkg.title}</Text>
                    {pkg.isPopular ? (
                      <Badge label="Популярний" tone="ok" />
                    ) : null}
                  </View>
                  <Text style={styles.pkgPrice}>
                    {Math.round(pkg.price).toLocaleString("uk-UA")} ₴
                    {pkg.duration ? ` · ${pkg.duration}` : ""}
                  </Text>
                  {pkg.description ? (
                    <Text style={styles.reviewText}>{pkg.description}</Text>
                  ) : null}
                  {pkg.includes ? (
                    <Text style={styles.fact}>Входить: {pkg.includes}</Text>
                  ) : null}
                </Card>
              ))}
            </View>
          ) : null}

          {vendor.services?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Послуги</Text>
              <View style={styles.meta}>
                {vendor.services.map((s) => (
                  <Badge key={s} label={s} tone="muted" />
                ))}
              </View>
            </View>
          ) : null}

          {vendor.team?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Команда</Text>
              {vendor.team.map((m) => (
                <Card key={m.id}>
                  <View style={styles.teamRow}>
                    {m.photoUrl ? (
                      <Image
                        source={{ uri: m.photoUrl }}
                        style={styles.teamPhoto}
                      />
                    ) : null}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pkgTitle}>{m.name}</Text>
                      <Text style={styles.fact}>{m.role}</Text>
                      {m.bio ? (
                        <Text style={styles.reviewText}>{m.bio}</Text>
                      ) : null}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : null}

          {vendor.faqs?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FAQ</Text>
              {vendor.faqs.map((f) => (
                <Card key={f.id}>
                  <Text style={styles.pkgTitle}>{f.question}</Text>
                  <Text style={styles.reviewText}>{f.answer}</Text>
                </Card>
              ))}
            </View>
          ) : null}

          {vendor.similar?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Схожі</Text>
              {vendor.similar.slice(0, 6).map((s) => (
                <Pressable
                  key={s.id}
                  style={styles.similarRow}
                  onPress={() =>
                    router.push(href(`/vendors/${s.slug || s.id}`))
                  }
                >
                  <Text style={styles.pkgTitle}>{s.name}</Text>
                  <Text style={styles.fact}>
                    {s.city} · від {s.priceFrom} ₴ · {s.rating.toFixed(1)}★
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {isCouple ? (
            <Card>
              <Text style={styles.sectionTitle}>Відгук</Text>
              <Input
                label="Оцінка (1–5)"
                keyboardType="number-pad"
                value={reviewRating}
                onChangeText={setReviewRating}
              />
              <Input
                label="Текст"
                multiline
                value={reviewText}
                onChangeText={setReviewText}
                style={{ minHeight: 80, textAlignVertical: "top" }}
              />
              {reviewMsg ? <Text style={styles.hint}>{reviewMsg}</Text> : null}
              <Button
                label={
                  myReviewQuery.data?.id
                    ? "Оновити відгук"
                    : "Залишити відгук"
                }
                loading={reviewMutation.isPending}
                onPress={() => {
                  setReviewMsg(null);
                  reviewMutation.mutate();
                }}
              />
            </Card>
          ) : null}

          {vendor.reviews?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Відгуки</Text>
              {vendor.reviews.map((r) => (
                <Card key={r.id}>
                  <Text style={styles.reviewAuthor}>
                    {r.user.name} · {r.rating}★
                  </Text>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </Card>
              ))}
            </View>
          ) : null}

          <View style={{ height: isCouple ? 88 : 24 }} />
        </ScrollView>

        {isCouple ? (
          <View style={styles.sticky}>
            <View style={styles.stickyBtn}>
              <Button
                label={isFavorite ? "В обраному" : "В обране"}
                variant="ghost"
                loading={favMutation.isPending}
                onPress={() => favMutation.mutate()}
              />
            </View>
            <View style={styles.stickyBtn}>
              <Button
                label="Написати"
                onPress={() => {
                  setReqMsg(null);
                  setShowRequest(true);
                }}
              />
            </View>
          </View>
        ) : null}
      </Screen>

      <Sheet
        visible={showRequest}
        title="Заявка"
        onClose={() => setShowRequest(false)}
        footer={
          <>
            <Button
              label="Надіслати"
              loading={requestMutation.isPending}
              disabled={
                !reqForm.eventDate ||
                reqForm.city.trim().length < 2 ||
                reqForm.message.trim().length < 3
              }
              onPress={() => {
                setReqMsg(null);
                requestMutation.mutate();
              }}
            />
            {reqMsg === "Заявку надіслано" ? (
              <Button
                label="До моїх заявок"
                variant="ghost"
                onPress={() => {
                  setShowRequest(false);
                  router.push(href("/(app)/(couple)/requests"));
                }}
              />
            ) : null}
          </>
        }
      >
        <Subtitle>Поля підтягнуті з твого весілля — можна правити</Subtitle>
        <DateField
          label="Дата події"
          value={reqForm.eventDate}
          onChange={(v) => setReqForm((s) => ({ ...s, eventDate: v }))}
        />
        <Input
          label="Місто"
          value={reqForm.city}
          onChangeText={(v) => setReqForm((s) => ({ ...s, city: v }))}
        />
        <Input
          label="Гості"
          keyboardType="number-pad"
          value={reqForm.guests}
          onChangeText={(v) => setReqForm((s) => ({ ...s, guests: v }))}
        />
        <Input
          label="Бюджет"
          keyboardType="number-pad"
          value={reqForm.budget}
          onChangeText={(v) => setReqForm((s) => ({ ...s, budget: v }))}
        />
        <Input
          label="Повідомлення"
          multiline
          value={reqForm.message}
          onChangeText={(v) => setReqForm((s) => ({ ...s, message: v }))}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />
        {reqMsg ? <Text style={styles.hint}>{reqMsg}</Text> : null}
        {requestMutation.isError ? (
          <ErrorBox
            message={
              requestMutation.error instanceof Error
                ? requestMutation.error.message
                : "Помилка"
            }
          />
        ) : null}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0, flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  gallery: { gap: 8, marginBottom: 14 },
  galleryImg: {
    width: 260,
    height: 180,
    borderRadius: 14,
    backgroundColor: colors.mist,
  },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  city: { fontSize: 14, color: colors.inkSoft, marginBottom: 12 },
  desc: { fontSize: 15, lineHeight: 22, color: colors.ink, marginBottom: 12 },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
  },
  fact: { fontSize: 13, color: colors.inkSoft, marginBottom: 4, lineHeight: 18 },
  pkgHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  pkgTitle: { fontSize: 15, fontWeight: "700", color: colors.ink, flex: 1 },
  pkgPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDeep,
    marginBottom: 6,
  },
  teamRow: { flexDirection: "row", gap: 10 },
  teamPhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.mist,
  },
  similarRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  hint: { marginBottom: 8, color: colors.primary, fontSize: 14 },
  reviewAuthor: { fontWeight: "600", color: colors.ink, marginBottom: 4 },
  reviewText: { color: colors.inkSoft, lineHeight: 20, marginTop: 4 },
  sticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingBottom: 20,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  stickyBtn: { flex: 1 },
});
