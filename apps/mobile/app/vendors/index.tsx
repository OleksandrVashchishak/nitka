import { useQuery } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { href } from "@/lib/href";
import {
  getCategories,
  getVendorFilters,
  getVendors,
} from "@/lib/vendors-api";
import type { Vendor } from "@/lib/types";
import { colors } from "@/theme";
import { ChipRow } from "@/ui/sheet";
import {
  Badge,
  Empty,
  ErrorBox,
  Input,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function VendorsScreen() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("rating");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [style, setStyle] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [showMore, setShowMore] = useState(false);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const filtersQuery = useQuery({
    queryKey: ["vendor-filters"],
    queryFn: getVendorFilters,
  });

  const vendorsQuery = useQuery({
    queryKey: [
      "vendors",
      { q, category, city, sort, featuredOnly, style, price, rating },
    ],
    queryFn: () =>
      getVendors({
        q: q.trim() || undefined,
        category,
        city: city.trim() || undefined,
        sort: sort !== "rating" ? sort : undefined,
        featured: featuredOnly ? "1" : undefined,
        style: style || undefined,
        price: price || undefined,
        rating: rating || undefined,
      }),
  });

  const categories = categoriesQuery.data ?? [];
  const vendors = vendorsQuery.data ?? [];
  const filterOpts = filtersQuery.data;

  const sortOptions = useMemo(() => {
    if (filterOpts?.sorts?.length) {
      return filterOpts.sorts.map((s) => ({ id: s.value, label: s.label }));
    }
    return [
      { id: "rating", label: "Рейтинг" },
      { id: "price_asc", label: "Ціна ↑" },
      { id: "price_desc", label: "Ціна ↓" },
      { id: "newest", label: "Нові" },
    ];
  }, [filterOpts]);

  const cityOptions = useMemo(() => {
    const cities = filterOpts?.cities ?? [];
    return [
      { id: "", label: "Усі міста" },
      ...cities.slice(0, 16).map((c) => ({ id: c, label: c })),
    ];
  }, [filterOpts]);

  const styleOptions = useMemo(() => {
    const styles = filterOpts?.styles ?? [];
    return [
      { id: "", label: "Усі стилі" },
      ...styles.slice(0, 20).map((s) => ({ id: s, label: s })),
    ];
  }, [filterOpts]);

  const priceOptions = useMemo(() => {
    const max = filterOpts?.maxPrice ?? 150000;
    const steps = [30000, 50000, 80000, 120000, max].filter(
      (v, i, arr) => v > 0 && arr.indexOf(v) === i,
    );
    return [
      { id: "", label: "Будь-яка ціна" },
      ...steps.map((p) => ({
        id: String(p),
        label: `до ${Math.round(p / 1000)}k`,
      })),
    ];
  }, [filterOpts]);

  const ratingOptions = useMemo(() => {
    const ratings = filterOpts?.ratings?.length
      ? filterOpts.ratings
      : [4.5, 4, 3.5];
    return [
      { id: "", label: "Будь-який ★" },
      ...ratings.map((r) => ({ id: String(r), label: `від ${r}★` })),
    ];
  }, [filterOpts]);

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Title>Підрядники</Title>
        <Subtitle>Знайди команду для свого дня</Subtitle>
        <Input
          placeholder="Пошук…"
          value={q}
          onChangeText={setQ}
          autoCorrect={false}
        />

        <Text style={styles.filterLabel}>Категорія</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label="Усі"
            active={!category}
            onPress={() => setCategory(undefined)}
          />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              active={category === c.slug}
              onPress={() => setCategory(c.slug)}
            />
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Місто</Text>
        <ChipRow options={cityOptions} value={city} onChange={setCity} />

        <Text style={styles.filterLabel}>Сортування</Text>
        <ChipRow options={sortOptions} value={sort} onChange={setSort} />

        <Chip
          label={featuredOnly ? "Тільки топ ✓" : "Тільки топ"}
          active={featuredOnly}
          onPress={() => setFeaturedOnly((v) => !v)}
        />

        <ButtonLike
          label={showMore ? "Сховати фільтри" : "Ще фільтри"}
          onPress={() => setShowMore((v) => !v)}
        />

        {showMore ? (
          <View>
            <Text style={styles.filterLabel}>Ціна від (max)</Text>
            <ChipRow options={priceOptions} value={price} onChange={setPrice} />
            <Text style={styles.filterLabel}>Рейтинг</Text>
            <ChipRow
              options={ratingOptions}
              value={rating}
              onChange={setRating}
            />
            <Text style={styles.filterLabel}>Стиль</Text>
            <ChipRow options={styleOptions} value={style} onChange={setStyle} />
          </View>
        ) : null}
      </View>
    ),
    [
      q,
      category,
      categories,
      city,
      cityOptions,
      sort,
      sortOptions,
      featuredOnly,
      showMore,
      price,
      priceOptions,
      rating,
      ratingOptions,
      style,
      styleOptions,
    ],
  );

  if (categoriesQuery.isLoading && vendorsQuery.isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Підрядники", headerShown: true }} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Підрядники", headerShown: true }} />
      <Screen style={styles.screen}>
        {(categoriesQuery.error || vendorsQuery.error) && (
          <ErrorBox
            message={
              (vendorsQuery.error as Error)?.message ||
              (categoriesQuery.error as Error)?.message ||
              "Помилка завантаження"
            }
          />
        )}
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            vendorsQuery.isLoading ? null : (
              <Empty title="Нікого не знайдено" hint="Спробуй інший пошук" />
            )
          }
          renderItem={({ item }) => <VendorRow vendor={item} />}
          refreshing={vendorsQuery.isRefetching}
          onRefresh={() => void vendorsQuery.refetch()}
        />
      </Screen>
    </>
  );
}

function ButtonLike({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.moreBtn}>
      <Text style={styles.moreBtnText}>{label}</Text>
    </Pressable>
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

function VendorRow({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={href(`/vendors/${vendor.slug || vendor.id}`)} asChild>
      <Pressable style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{vendor.name}</Text>
          <Text style={styles.rowSub}>
            {vendor.category?.name}
            {vendor.city ? ` · ${vendor.city}` : ""}
          </Text>
          <Text style={styles.price}>від {vendor.priceFrom} ₴</Text>
        </View>
        <View style={styles.rowRight}>
          {vendor.featured ? <Badge label="Топ" tone="ok" /> : null}
          <Badge label={`${vendor.rating.toFixed(1)}★`} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  list: { paddingBottom: 24 },
  chips: { gap: 8, paddingBottom: 8 },
  filterLabel: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.inkSoft,
  },
  moreBtn: { paddingVertical: 8, marginBottom: 4 },
  moreBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDeep,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.inkSoft },
  chipTextActive: { color: colors.white },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: colors.ink },
  rowSub: { marginTop: 2, fontSize: 13, color: colors.inkSoft },
  price: { marginTop: 6, fontSize: 13, fontWeight: "600", color: colors.primary },
  rowRight: { alignItems: "flex-end", gap: 6 },
});
